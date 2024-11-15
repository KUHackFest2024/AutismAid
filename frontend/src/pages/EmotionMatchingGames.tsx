import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Video, VideoOff } from "lucide-react";

const questions = [
  {
    id: 1,
    question: "How does this face feel?",
    image:
      "https://as2.ftcdn.net/v2/jpg/02/46/14/95/1000_F_246149544_RZIU2J7fQKl9JVWZBeSvJHUCRtdjTqAl.jpg",
    options: [
      { text: "Super Happy", emoji: "😊", correct: true },
      { text: "Big Sad", emoji: "😢", correct: false },
      { text: "Grumpy Face", emoji: "😠", correct: false },
      { text: "Wow Face", emoji: "😲", correct: false },
    ],
  },
  {
    id: 2,
    question: "What's this face doing?",
    image:
      "https://gratisography.com/wp-content/uploads/2022/10/gratisography-scared-14-free-stock-photo-1170x780.jpg",
    options: [
      { text: "Super Excited", emoji: "🤩", correct: false },
      { text: "Uh-oh Scared", emoji: "😨", correct: true },
      { text: "Yucky Face", emoji: "🤢", correct: false },
      { text: "Sleepy Time", emoji: "😴", correct: false },
    ],
  },
];

const EmotionMatchingGames: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  const setupDevices = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Oopsie! Can't see your happy face:", err);
    }
  };

  const stopDevices = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const videoStream = videoRef.current.srcObject as MediaStream;
      videoStream.getTracks().forEach((track) => track.stop());
    }
  };

  useEffect(() => {
    setupDevices();
    return () => {
      stopDevices();
    };
  }, []);

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setFeedbackMessage("Yay! You're a feeling finder superstar! 🌟🎉");
    } else {
      setFeedbackMessage(
        "Oopsie daisy! Let's try again, you're doing great! 🌈💪"
      );
    }
    setShowFeedback(true);
    if (correct) {
      setTimeout(() => {
        setShowFeedback(false);
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        }
      }, 2000);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const quitGame = () => {
    stopDevices();
    navigate("/child-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-8 relative">
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 left-4 z-10"
        onClick={quitGame}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Back to Fun Zone</span>
      </Button>

      <div className="absolute top-4 right-4 w-64 h-48 rounded-lg overflow-hidden shadow-lg border-4 border-purple-400 bg-gray-100">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${isCameraOn ? "" : "hidden"}`}
        />
        {!isCameraOn && (
          <div className="w-full h-full flex items-center justify-center">
            <VideoOff className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      <motion.h1
        className="text-4xl font-bold text-center text-purple-700 mb-8 pt-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Feeling Finder Fun!
      </motion.h1>

      <Card className="max-w-2xl mx-auto bg-yellow-100 border-4 border-purple-400">
        <CardContent className="p-6">
          <h2 className="text-3xl font-bold text-purple-700 mb-4">
            {questions[currentQuestion].question}
          </h2>
          <div className="flex justify-center mb-6">
            <img
              src={questions[currentQuestion].image}
              alt="Guess the feeling"
              className="w-64 h-64 object-cover rounded-lg shadow-md border-4 border-purple-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(option.correct)}
                className="text-lg py-8 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl shadow-lg transform transition-all hover:scale-105"
              >
                <span className="text-5xl mr-2">{option.emoji}</span>
                <span className="font-bold">{option.text}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-8 max-w-2xl mx-auto">
        <Button
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className="bg-blue-500 hover:bg-blue-600 text-white text-xl py-2 px-6 rounded-full"
        >
          ⬅️ Previous
        </Button>
        <Button
          onClick={quitGame}
          variant="outline"
          className="bg-red-500 hover:bg-red-600 text-white text-xl py-2 px-6 rounded-full"
        >
          🚪 Exit Game
        </Button>
        <Button
          onClick={nextQuestion}
          disabled={currentQuestion === questions.length - 1}
          className="bg-green-500 hover:bg-green-600 text-white text-xl py-2 px-6 rounded-full"
        >
          Next ➡️
        </Button>
      </div>

      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent className="sm:max-w-[425px] bg-gradient-to-r from-purple-200 to-pink-200 border-4 border-purple-400">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-purple-700">
              Feeling Feedback
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <p className="text-2xl text-center py-4 text-purple-600">
              {feedbackMessage}
            </p>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmotionMatchingGames;
