import React, { useState, useEffect, useRef } from "react";
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
import { ArrowLeft } from "lucide-react";

const questions = [
  {
    id: 1,
    question: "What is this person feeling?",
    image: "/happy.jpg",
    options: [
      { text: "Sad", emoji: "😢", correct: false },
      { text: "Angry", emoji: "😠", correct: false },
      { text: "Confused", emoji: "😕", correct: false },
      { text: "Happy", emoji: "😊", correct: true },
    ],
  },
  {
    id: 2,
    question: "How does this person feel?",
    image: "/scared.jpg",
    options: [
      { text: "Excited", emoji: "🤩", correct: false },
      { text: "Scared", emoji: "😢", correct: true },
      { text: "Surprised", emoji: "😲", correct: false },
      { text: "Bored", emoji: "😐", correct: false },
    ],
  },
  {
    id: 3,
    question: "What emotion is this person showing?",
    image: "/angry.jpg",
    options: [
      { text: "Happy", emoji: "😊", correct: false },
      { text: "Scared", emoji: "😨", correct: false },
      { text: "Angry", emoji: "😠", correct: true },
      { text: "Excited", emoji: "🤩", correct: false },
    ],
  },
  {
    id: 4,
    question: "What does this person feel?",
    image: "/Scared2.jpg",
    options: [
      { text: "Happy", emoji: "😊", correct: false },
      { text: "Scared", emoji: "😨", correct: true },
      { text: "Angry", emoji: "😠", correct: false },
      { text: "Sleepy!", emoji: "😴", correct: false },
    ],
  },
];

const EmotionMatchingGames: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [emotion, setEmotion] = useState("Unknown");
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmotion = async () => {
      try {
        const response = await fetch("http://192.168.50.71:8000/get_emotion");
        if (response.ok) {
          const data = await response.text();
          setEmotion(data);
        }
      } catch (error) {
        console.error("Error fetching emotion data:", error);
      }
    };

    const interval = setInterval(fetchEmotion, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = questions.map((question) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = question.image;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error("Error preloading images:", error);
      }
    };

    preloadImages();
  }, []);

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setFeedbackMessage("Yay! You're a feeling finder superstar! 🌟🎉");
      setCorrectCount((prevCount) => prevCount + 1);
    } else {
      setFeedbackMessage(
        "Oopsie daisy! Let's try again, you're doing great! 💪"
      );
      setIncorrectCount((prevCount) => prevCount + 1);
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

  const quitGame = async () => {
    const stopVideo = async () => {
      const res = await fetch("http://192.168.50.71:8000/video_feed_exit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correct: correctCount.toString(),
          incorrect: incorrectCount.toString(),
        }),
      });
    };
    await stopVideo();
    navigate("/child-dashboard");
  };

  if (!imagesLoaded) {
    return <div>Loading...</div>;
  }

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
        <h1>Emotion: {emotion}</h1>
        <img
          src={"http://192.168.50.71:8000/video_feed"}
          alt="Video Feed"
          className="w-full h-full object-cover"
        />
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
