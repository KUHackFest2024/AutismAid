import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

// Dummy data for charts
const emotionData = [
  { name: "Happy", value: 30 },
  { name: "Sad", value: 15 },
  { name: "Angry", value: 10 },
  { name: "Surprised", value: 22 },
  { name: "Scared", value: 18 },
  { name: "Disgusted", value: 5 },
];

const progressData = [
  { month: "Jan", score: 65 },
  { month: "Feb", score: 70 },
  { month: "Mar", score: 75 },
  { month: "Apr", score: 72 },
  { month: "May", score: 78 },
  { month: "Jun", score: 82 },
];

const activityData = [
  { name: "Emotion Learning", time: 120 },
  { name: "Friend Finder", time: 80 },
  { name: "Story Time", time: 100 },
  { name: "Puzzle Solving", time: 60 },
  { name: "Music Therapy", time: 90 },
];

interface ChildData {
  id: number;
  name: string;
  age: number;
  gender: string;
  diagnosis: string;
  strengths: string[];
  challenges: string[];
}

const ChildAnalysis: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const childData = location.state as ChildData;

  if (!childData) {
    return <div>No child data available</div>;
  }

  const getProfileImage = (gender: string) => {
    return gender === "female"
      ? "/placeholder.svg?height=128&width=128&text=F"
      : "/placeholder.svg?height=128&width=128&text=M";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-8">
      <Button
        variant="outline"
        size="icon"
        className="mb-4"
        onClick={() => navigate("/caretaker-dashboard")}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Back to Dashboard</span>
      </Button>

      <motion.h1
        className="text-4xl font-bold text-center text-purple-700 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Child Analysis
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-purple-300">
                <img
                  src={getProfileImage(childData.gender)}
                  alt={`${childData.name}'s avatar`}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-purple-700 mb-2">
                {childData.name}
              </h2>
              <p className="text-purple-600 mb-4">ID: {childData.id}</p>
              <p className="text-purple-600 mb-2">Age: {childData.age}</p>
              <p className="text-purple-600 mb-4">
                Diagnosis: {childData.diagnosis}
              </p>
              <div className="text-left w-full">
                <h3 className="font-semibold mb-2">Strengths:</h3>
                <ul className="list-disc pl-5 mb-4">
                  {childData.strengths.map((strength, index) => (
                    <li key={index} className="text-purple-600">
                      {strength}
                    </li>
                  ))}
                </ul>
                <h3 className="font-semibold mb-2">Challenges:</h3>
                <ul className="list-disc pl-5">
                  {childData.challenges.map((challenge, index) => (
                    <li key={index} className="text-purple-600">
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Progress Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Emotion Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={emotionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Engagement (minutes)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="time" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Observations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Showed improved focus during emotion learning activities</li>
              <li>
                Demonstrated better social interaction in friend finder sessions
              </li>
              <li>Expressed increased interest in musical activities</li>
              <li>Struggled with sudden changes in routine</li>
              <li>Responded positively to visual schedules and reminders</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChildAnalysis;
