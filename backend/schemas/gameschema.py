from pydantic import BaseModel

class GameSchema(BaseModel):
    tag:str
    attentive:int
    distracted:int
    happy:int
    sad:int
    angry:int
    disgusted:int
    fear:int
    sad:int
    surprise:int
    neutral:int

class GameAnswer(BaseModel):
    correct:str
    incorrect:str
