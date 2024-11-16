from fastapi import FastAPI, Response, Depends
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import dlib
from imutils import face_utils
import io
import threading
from datetime import datetime, timedelta

from pydantic import BaseModel



from sqlalchemy.orm import Session,aliased
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import select,func

# from database.configurations import SessionLocal,engine,Base
from database.configuration import SessionLocal,engine,Base
from models import gamesmodel
from schemas import gameschema


from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image


app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to specific domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def db_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

cap = cv2.VideoCapture(0)


# --------------------------------Face_Recog------------------------------------------
model_best = load_model('face_model.h5') # set your machine model file path here
# Classes 7 emotional states
class_names = ['Angry', 'Disgusted', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
emotional_state="neutral"

emotion_counter = {
    'Angry': 0,
    'Disgusted': 0,
    'Fear': 0,
    'Happy': 0,
    'Sad': 0,
    'Surprise': 0,
    'Neutral': 0
}

distract_threshold = 100

# -----------------------------------------------------------------------------

#Initializing the face detector and landmark detector
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")

# ------------------------------------------------
width  = int(cap.get(3))  # float `width`
height = int(cap.get(4))  # float `height`
size = (width,height)
focal_length = size[1]  # Approximate focal length
center = (size[1] / 2, size[0] / 2)
camera_matrix = np.array([
    [focal_length, 0, center[0]],
    [0, focal_length, center[1]],
    [0, 0, 1]
], dtype="double")
# Assuming no lens distortion
dist_coeffs = np.zeros((4, 1))  

model_points = np.array([
    (0.0, 0.0, 0.0),            # Nose tip
    (0.0, -330.0, -65.0),       # Chin
    (-225.0, 170.0, -135.0),    # Left eye left corner
    (225.0, 170.0, -135.0),     # Right eye right corner
    (-150.0, -150.0, -125.0),   # Left mouth corner
    (150.0, -150.0, -125.0)     # Right mouth corner
])
# -----------------------------------------------------------

#status marking for current state
sleep = 0
drowsy = 0
active = 0
status=""
color=(0,0,0)

start_time = None
attention_time = timedelta(0)  # Total time in attention
distracted_time = timedelta(0)

def compute(ptA,ptB):
	dist = np.linalg.norm(ptA - ptB)
	return dist

def blinked(a,b,c,d,e,f):
	up = compute(b,d) + compute(c,e)
	down = compute(a,f)
	ratio = up/(2.0*down)

	#Checking if it is blinked
	if(ratio>0.25):
		return 2
	elif(ratio>0.21 and ratio<=0.25):
		return 1
	else:
		return 0


streaming_active = True
lock = threading.Lock()

def generate_frames():
    global status,active,drowsy,sleep,streaming_active,cap,start_time, attention_time,distracted_time,emotional_state,emotion_counter
    while True:
        with lock:
            if not streaming_active:
                break

        _, frame = cap.read()
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # --------------------------------------face_emo
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5, minSize=(30, 30))

        # Process each detected face
        for (x, y, w, h) in faces:
            # Extract the face region
            face_roi = frame[y:y + h, x:x + w]

            # Resize the face image to the required input size for the model
            face_image = cv2.resize(face_roi, (48, 48))
            face_image = cv2.cvtColor(face_image, cv2.COLOR_BGR2GRAY)
            face_image = image.img_to_array(face_image)
            face_image = np.expand_dims(face_image, axis=0)
            face_image = np.vstack([face_image])

            # Predict emotion using the loaded model
            predictions = model_best.predict(face_image)
            emotion_label = class_names[np.argmax(predictions)]
            emotional_state = emotion_label
            emotion_counter[emotion_label] += 1
            print("count:",emotion_counter)

        # ----------------------------------------------

        faces = detector(gray)
        face_frame = frame.copy()
        #detected face in faces array

        cl=cr=0


        if len(faces) > 0:
            # Assume attention if a face is detected
            # pass
            current_time = datetime.now()
            if start_time is not None:
                attention_time += (current_time - start_time)
                start_time = current_time
        else:
            # Assume distracted if no face is detected
            current_time = datetime.now()
            if start_time is not None:
                distracted_time += (current_time - start_time)
                start_time = current_time
            
        for face in faces:
            x1 = face.left()
            y1 = face.top()
            x2 = face.right()
            y2 = face.bottom()

            # face_frame = frame.copy()
            cv2.rectangle(face_frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

            landmarks = predictor(gray, face)
            landmarks = face_utils.shape_to_np(landmarks)

            #The numbers are actually the landmarks which will show eye
            left_blink = blinked(landmarks[36],landmarks[37], 
                landmarks[38], landmarks[41], landmarks[40], landmarks[39])
            right_blink = blinked(landmarks[42],landmarks[43], 
                landmarks[44], landmarks[47], landmarks[46], landmarks[45])

            # --------------------------------------
            # Define 2D image points
            image_points = np.array([
                landmarks[30],  # Nose tip
                landmarks[8],   # Chin
                landmarks[36],  # Left eye left corner
                landmarks[45],  # Right eye right corner
                landmarks[48],  # Left mouth corner
                landmarks[54]   # Right mouth corner
            ], dtype="double")

            # Calculate head pose
            success, rotation_vector, translation_vector = cv2.solvePnP(
                model_points, image_points, camera_matrix, dist_coeffs
            )

            # Project a 3D point (0, 0, 1000) to see where the nose points
            (nose_end_point2D, _) = cv2.projectPoints(
                np.array([(0.0, 0.0, 1000.0)]), rotation_vector, translation_vector, camera_matrix, dist_coeffs
            )

            # Draw the face orientation
            p1 = (int(image_points[0][0]), int(image_points[0][1]))  # Nose tip
            p2 = (int(nose_end_point2D[0][0][0]), int(nose_end_point2D[0][0][1]))
            cv2.line(frame, p1, p2, (0, 255, 0), 2)


            if p1[0] > p2[0]:
                cl += 1
            else:
                cr += 1

            if cl > cr:
                text = 'left'
                # status = "Looking Left"
                status = "Distracted"
                color = (70, 122, 200)
                current_time = datetime.now()
                if start_time is not None:
                    attention_time += (current_time - start_time)
                    start_time = current_time
            else:
                text = 'right'
                # status = "Looking Right"
                status = "Distracted"
                current_time = datetime.now()
                if start_time is not None:
                    distracted_time += (current_time - start_time)
                    start_time = current_time
                    color = (70, 122, 200)

            # ///////////////////////////////////////
            # Calculate angles for head orientation
            # rvec_matrix = cv2.Rodrigues(rotation_vector)[0]
            # proj_matrix = np.hstack((rvec_matrix, translation_vector))
            # euler_angles = cv2.decomposeProjectionMatrix(proj_matrix)[6]  # [pitch, yaw, roll]

            # pitch, yaw, roll = [angle[0] for angle in euler_angles]

            # # Check if face is "straight"
            # if abs(yaw) < 15 and abs(pitch) < 15:
            #     status = "Looking Forward"
            #     color = (0, 255, 0)
            # else:
            #     status = "Not Looking Forward"
            #     color = (0, 0, 255)
            # ////////////////////////////////////

            # --------------------------------------
            
            #Now judge what to do for the eye blinks
            if(left_blink==0 or right_blink==0):
                sleep+=1
                drowsy=0
                active=0
                if(sleep>6):
                    # status="SLEEPING !!!"
                    status="Distracted"
                    color = (255,0,0)
                    current_time = datetime.now()
                    if start_time is not None:
                        distracted_time += (current_time - start_time)
                        start_time = current_time
                        
            elif(left_blink==1 or right_blink==1):
                sleep=0
                active=0
                drowsy+=1
                if(drowsy>6):
                    # status="Drowsy !"
                    status="Distracted"
                    color = (0,0,255)
                    current_time = datetime.now()
                    if start_time is not None:
                        attention_time += (current_time - start_time)
                        start_time = current_time
                    
            else:
                drowsy=0
                sleep=0
                active+=1
                if(active>6):
                    status="Attentive"
                    color = (0,255,0)
                    current_time = datetime.now()
                    if start_time is not None:
                        attention_time += (current_time - start_time)
                        start_time = current_time
                
            cv2.putText(frame, status, (100,100), cv2.FONT_HERSHEY_SIMPLEX, 1.2, color,3)

            for n in range(0, 68):
                (x,y) = landmarks[n]
                cv2.circle(face_frame, (x, y), 1, (255, 255, 255), -1)
            
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        # Yield the frame in byte format
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            #    b'Content-Type: text/plain\r\n\r\n' + emotional_state.encode() + b'\r\n\r\n')

@app.get("/home")
def home():
    print("hgsag")
    return "Yellow!"

@app.get("/get_emotion")
async def get_emotion():
    global emotional_state
    print(emotional_state)
    return {"emotion": emotional_state} 

@app.get("/video_feed")
async def video_feed():
    global streaming_active,cap,start_time
    with lock:
        if not cap.isOpened():
            cap = cv2.VideoCapture(0)
        streaming_active = True 
        start_time = datetime.now()
    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")

@app.get("/get_flag")
def get_flag():
    global attention_time,distract_threshold
    if (attention_time > distract_threshold):
        return {"showFlag":1}
    else:
        return {"showFlag":0}

@app.post("/video_feed_exit")
async def video_feed_exit(answer:gameschema.GameAnswer,session:Session = Depends(db_session)):
    global streaming_active,cap,distracted_time,start_time,emotion_counter
    with lock:
        if start_time is not None:
            # Calculate distracted time when the video feed is exited
            distracted_time += (datetime.now() - start_time)
            start_time = None
        streaming_active = False
    # cap.release()
    if cap.isOpened():
        cap.release()
    print("attention",attention_time.total_seconds())
    print("distraction",distracted_time.total_seconds())
    try:
        new_game = gamesmodel.Game(tag="flashcard",attentive=int(attention_time.total_seconds()),distracted=int(distracted_time.total_seconds()),correct=int(answer.correct),incorrect=int(answer.incorrect),
                                   happy=emotion_counter["Happy"],sad=emotion_counter["Sad"],surprise=emotion_counter["Surprise"],angry=emotion_counter["Angry"],
                                   disgusted=emotion_counter["Disgusted"],fear=emotion_counter["Fear"],neutral=emotion_counter["Neutral"])
        session.add(new_game)
        session.commit()
        session.refresh(new_game)
    except SQLAlchemyError as e:
        print(f" errorxxx : {e.__dict__['orig']}")
        return {"message":"User creation failed!","status":500,"error":f"{e.__dict__['orig']}"}
    return {"message":"game added successfully","status":200}
    pass

@app.get("/exit_video")
async def exit_video():
    global streaming_active,cap,distracted_time,start_time,emotion_counter
    # with lock:
    #     if start_time is not None:
    #         # Calculate distracted time when the video feed is exited
    #         distracted_time += (datetime.now() - start_time)
    #         start_time = None
    #     streaming_active = False
    # cap.release()
    if cap.isOpened():
        cap.release()
    # print("attention",attention_time.total_seconds())
    # print("distraction",distracted_time.total_seconds())
    # try:
    #     new_game = gamesmodel.Game(tag="flashcard",attentive=int(attention_time.total_seconds()),distracted=int(distracted_time.total_seconds()),correct=int(answer.correct),incorrect=int(answer.incorrect),
    #                                happy=emotion_counter["Happy"],sad=emotion_counter["Sad"],surprise=emotion_counter["Surprise"],angry=emotion_counter["Angry"],
    #                                disgusted=emotion_counter["Disgusted"],fear=emotion_counter["Fear"],neutral=emotion_counter["Neutral"])
    #     session.add(new_game)
    #     session.commit()
    #     session.refresh(new_game)
    # except SQLAlchemyError as e:
    #     print(f" errorxxx : {e.__dict__['orig']}")
    #     return {"message":"User creation failed!","status":500,"error":f"{e.__dict__['orig']}"}
    # return {"message":"game added successfully","status":200}
    pass

@app.get("/get_attention")
def get_attention(db_session:Session = Depends(db_session)):
    game = gamesmodel.Game
    statement = select(game)
    result = db_session.execute(statement)

    attentive_data = {}
    distracted_data = {}

    for row in result.scalars().all():
        attentive_data[row.id] = row.attentive
        distracted_data[row.id] = row.distracted
    
    return {
        "attentive": attentive_data,
        "distracted": distracted_data
    }

    # games_data = []
    # for row in result.scalars().all():
    #     games_data.append({
    #         "id": row.id,
    #         "attentive": row.attentive,
    #         "distracted": row.distracted
    #     })

@app.get("/get_emotions")
def get_emotion(db_session:Session = Depends(db_session)):
    statement = select(
        func.sum(gamesmodel.Game.happy).label('happy_sum'),
        func.sum(gamesmodel.Game.sad).label('sad_sum'),
        func.sum(gamesmodel.Game.fear).label('fear_sum'),
        func.sum(gamesmodel.Game.angry).label('angry_sum'),
        func.sum(gamesmodel.Game.disgusted).label('disgusted_sum'),
        func.sum(gamesmodel.Game.surprise).label('surprise_sum'),
        func.sum(gamesmodel.Game.neutral).label('neutral_sum')
    )
    
    # Execute the query
    result = db_session.execute(statement).one()

    # Prepare JSON structure
    emotions_data = {
        "happy": result.happy_sum or 0,
        "sad": result.sad_sum or 0,
        "fear": result.fear_sum or 0,
        "angry": result.angry_sum or 0,
        "disgusted": result.disgusted_sum or 0,
        "surprise": result.surprise_sum or 0,
        "neutral": result.neutral_sum or 0,
    }

    # Return JSON response with summed emotion counts
    return emotions_data
    pass

@app.get("/quiz_result")
def get_result(db_session:Session = Depends(db_session)):
        # SQLAlchemy select query to get all quiz rows
    statement = select(gamesmodel.Game.id, gamesmodel.Game.correct, gamesmodel.Game.incorrect)
    
    # Execute the query
    results = db_session.execute(statement).all()
    
    # Prepare JSON structure for correct and incorrect answers
    quiz_data = {
        "correct": {},
        "incorrect": {}
    }
    
    # Iterate through the result rows
    for row in results:
        quiz_data["correct"][str(row.id)] = row.correct or 0
        quiz_data["incorrect"][str(row.id)] = row.incorrect or 0

    # Return the JSON response with structured quiz data
    return quiz_data
    pass
     