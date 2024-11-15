import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Smile, Gamepad2 } from "lucide-react";

const colors = [
  { name: "Soft Blue", value: "#E6F3FF" },
  { name: "Gentle Green", value: "#E8F5E9" },
  { name: "Light Yellow", value: "#FFF9C4" },
  { name: "Pale Pink", value: "#FCE4EC" },
  { name: "Lavender", value: "#F3E5F5" },
  { name: "Peach", value: "#FFF0E0" },
  { name: "Mint", value: "#E0F2F1" },
];

const musicTracks = [
  { name: "Calm Piano", src: "/music/calm-piano.mp3" },
  { name: "Nature Sounds", src: "/music/nature-sounds.mp3" },
  { name: "Soft Guitar", src: "/music/soft-guitar.mp3" },
  { name: "Gentle Strings", src: "/music/gentle-strings.mp3" },
];

const ChildDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors[0].value);
  const [selectedMusic, setSelectedMusic] = useState(musicTracks[0].src);
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);

  const activities = [
    {
      icon: Smile,
      title: "Emotion Learning",
      description: "Learn about different emotions",
      path: "/emotion-learning",
    },
    {
      icon: Gamepad2,
      title: "Emotion Matching Games",
      description: "Try to Figure out the Emotion",
      path: "/emotion-matching-games",
    },
  ];

  const handleStartActivity = () => {
    setIsDialogOpen(true);
  };

  const handleStartLearning = () => {
    setIsDialogOpen(false);
    navigate("/emotional-learning", {
      state: {
        backgroundColor: selectedColor,
        musicSrc: isMusicEnabled ? selectedMusic : null,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-8">
      <motion.h1
        className="text-4xl font-bold text-center text-purple-700 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome to Your Dashboard!
      </motion.h1>
      <div className="grid md:grid-cols-3 gap-6">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full border-2 border-purple-200 hover:border-purple-400 transition-colors">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <activity.icon className="h-12 w-12 text-purple-500 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-purple-700">
                  {activity.title}
                </h3>
                <p className="text-purple-600 mb-4">{activity.description}</p>
                <Button
                  onClick={
                    activity.title === "Emotion Learning"
                      ? handleStartActivity
                      : () => navigate(activity.path)
                  }
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Start Activity
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choose Your Learning Environment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-7 py-4">
            <div className="grid grid-cols-4 gap-4">
              {colors.map((color) => (
                <div
                  key={color.value}
                  className={`w-10 h-10 rounded-full cursor-pointer border-2 ${
                    selectedColor === color.value
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setSelectedColor(color.value)}
                />
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="music-enabled"
                checked={isMusicEnabled}
                onCheckedChange={(checked) =>
                  setIsMusicEnabled(checked as boolean)
                }
              />
              <Label htmlFor="music-enabled">Enable background music</Label>
            </div>
            {isMusicEnabled && (
              <RadioGroup
                value={selectedMusic}
                onValueChange={setSelectedMusic}
              >
                {musicTracks.map((track) => (
                  <div key={track.src} className="flex items-center space-x-2">
                    <RadioGroupItem value={track.src} id={track.src} />
                    <Label htmlFor={track.src}>{track.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleStartLearning}>Start Learning</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChildDashboard;
