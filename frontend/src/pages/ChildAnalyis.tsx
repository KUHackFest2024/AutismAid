import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import {
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  CartesianGrid,
} from "recharts";

interface ChildData {
  id: number;
  name: string;
  age: number;
  gender: string;
  diagnosis: string;
  strengths: string[];
  challenges: string[];
}

interface EmotionData {
  name: string;
  value: number;
}

interface ApiResponse {
  [key: string]: number;
}

interface AttentionData {
  attentive: { [key: string]: number };
  distracted: { [key: string]: number };
}

interface QuizResultData {
  correct: { [key: string]: number };
  incorrect: { [key: string]: number };
}

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#FF6384",
];

const ChildAnalysis: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const childData = location.state as ChildData;
  const [emotionData, setEmotionData] = useState<EmotionData[]>([]);
  const [attentionData, setAttentionData] = useState<
    { game: number; attentive: number; distracted: number }[]
  >([]);
  const [quizResultData, setQuizResultData] = useState<
    { game: number; correct: number; incorrect: number }[]
  >([]);
  const [therapistNote, setTherapistNote] = useState("");

  useEffect(() => {
    const fetchEmotionData = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          "http://192.168.50.71:8000/get_emotions"
        );
        const data = response.data;
        const total = Object.values(data).reduce(
          (acc: number, val: number) => acc + val,
          0
        );
        const formattedData: EmotionData[] = Object.entries(data).map(
          ([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value: Number((((value as number) / total) * 100).toFixed(2)),
          })
        );
        setEmotionData(formattedData);
      } catch (error) {
        console.error("Error fetching emotion data:", error);
      }
    };

    const fetchAttentionData = async () => {
      try {
        const response = await axios.get<AttentionData>(
          "http://192.168.50.71:8000/get_attention"
        );
        const data = response.data;
        const formattedData = Object.keys(data.attentive).map((key) => ({
          game: parseInt(key),
          attentive: data.attentive[key],
          distracted: data.distracted[key],
        }));
        setAttentionData(formattedData);
      } catch (error) {
        console.error("Error fetching attention data:", error);
      }
    };

    const fetchQuizResultData = async () => {
      try {
        const response = await axios.get<QuizResultData>(
          "http://192.168.50.71:8000/quiz_result"
        );
        const data = response.data;
        const formattedData = Object.keys(data.correct).map((key) => ({
          game: parseInt(key),
          correct: data.correct[key],
          incorrect: data.incorrect[key],
        }));
        setQuizResultData(formattedData);
      } catch (error) {
        console.error("Error fetching quiz result data:", error);
      }
    };

    const fetchTherapistNote = async () => {
      try {
        const response = await axios.get(
          `http://192.168.50.71:8000/get_therapist_note/${childId}`
        );
        setTherapistNote(response.data.note);
      } catch (error) {
        console.error("Error fetching therapist note:", error);
      }
    };

    fetchEmotionData();
    fetchAttentionData();
    fetchQuizResultData();
    fetchTherapistNote();
  }, [childId]);

  if (!childData) {
    return <div>No child data available</div>;
  }

  const getProfileImage = (gender: string) => {
    return gender === "female"
      ? "https://cdn.pixabay.com/photo/2013/07/12/19/26/anime-154775_1280.png"
      : "https://cdn.pixabay.com/photo/2024/04/03/06/50/created-by-ai-8672238_960_720.png";
  };

  const aggregateDataByPeriod = (
    data: typeof quizResultData,
    period: "game" | "day" | "week"
  ) => {
    if (period === "game") return data;

    const aggregated = data.reduce((acc, curr, index) => {
      const periodIndex =
        period === "day" ? Math.floor(index / 4) : Math.floor(index / 28);
      if (!acc[periodIndex]) {
        acc[periodIndex] = { game: periodIndex + 1, correct: 0, incorrect: 0 };
      }
      acc[periodIndex].correct += curr.correct;
      acc[periodIndex].incorrect += curr.incorrect;
      return acc;
    }, [] as typeof quizResultData);

    return Object.values(aggregated);
  };

  const generateObservations = () => {
    const observations: string[] = [];

    // Analyze progress data
    if (quizResultData.length > 1) {
      const latestGame = quizResultData[quizResultData.length - 1];
      const previousGame = quizResultData[quizResultData.length - 2];
      if (latestGame.correct > previousGame.correct) {
        observations.push("Showed improvement in emotion recognition accuracy");
      } else if (latestGame.correct < previousGame.correct) {
        observations.push(
          "Experienced a slight decline in emotion recognition accuracy"
        );
      }
    }

    // Analyze emotion data
    if (emotionData.length > 0) {
      const dominantEmotion = emotionData.reduce((prev, current) =>
        prev.value > current.value ? prev : current
      );
      observations.push(
        `Displayed a predominant ${dominantEmotion.name.toLowerCase()} emotion during sessions`
      );
    }

    // Analyze attention data
    if (attentionData.length > 1) {
      const latestGame = attentionData[attentionData.length - 1];
      const previousGame = attentionData[attentionData.length - 2];
      if (latestGame.attentive > previousGame.attentive) {
        observations.push(
          "Demonstrated increased focus and attention during recent activities"
        );
      } else if (latestGame.attentive < previousGame.attentive) {
        observations.push(
          "Showed signs of decreased attention span in recent sessions"
        );
      }
    }

    // Add general observations
    observations.push("Responded positively to visual schedules and reminders");
    observations.push(
      "Continued to show interest in interactive emotion learning games"
    );

    return observations;
  };

  const handleSaveNote = async () => {
    try {
      await axios.post(
        `http://192.168.50.71:8000/save_therapist_note/${childId}`,
        { note: therapistNote }
      );
      alert("Note saved successfully!");
    } catch (error) {
      console.error("Error saving therapist note:", error);
      alert("Failed to save note. Please try again.");
    }
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
        Child Analysis: {childData.name}
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
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Progress Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="game" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="game">By Game</TabsTrigger>
                <TabsTrigger value="day">By Day</TabsTrigger>
                <TabsTrigger value="week">By Week</TabsTrigger>
              </TabsList>
              <TabsContent value="game">
                <ProgressChart
                  data={aggregateDataByPeriod(quizResultData, "game")}
                  xAxisLabel="Game Number"
                />
              </TabsContent>
              <TabsContent value="day">
                <ProgressChart
                  data={aggregateDataByPeriod(quizResultData, "day")}
                  xAxisLabel="Day"
                />
              </TabsContent>
              <TabsContent value="week">
                <ProgressChart
                  data={aggregateDataByPeriod(quizResultData, "week")}
                  xAxisLabel="Week"
                />
              </TabsContent>
            </Tabs>
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
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {emotionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attention Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={attentionData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="game"
                  label={{
                    value: "Game Number",
                    position: "insideBottomRight",
                    offset: -10,
                  }}
                />
                <YAxis
                  label={{
                    value: "Time (seconds)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="attentive"
                  name="Attentive Time"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="distracted"
                  name="Distracted Time"
                  stroke="#ff7300"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Observations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {generateObservations().map((observation, index) => (
                <li key={index}>{observation}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Therapist Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={therapistNote}
              onChange={(e) => setTherapistNote(e.target.value)}
              placeholder="Enter your notes here..."
              className="min-h-[200px] mb-4"
            />
            <Button onClick={handleSaveNote}>Save Note</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ProgressChart: React.FC<{
  data: { game: number; correct: number; incorrect: number }[];
  xAxisLabel: string;
}> = ({ data, xAxisLabel }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="game"
        label={{
          value: xAxisLabel,
          position: "insideBottomRight",
          offset: -10,
        }}
      />
      <YAxis
        label={{
          value: "Number of Answers",
          angle: -90,
          position: "insideLeft",
        }}
      />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="correct"
        name="Correct Answers"
        stroke="#82ca9d"
        strokeWidth={2}
        dot={{ r: 4 }}
        activeDot={{ r: 8 }}
      />
      <Line
        type="monotone"
        dataKey="incorrect"
        name="Incorrect Answers"
        stroke="#ff7300"
        strokeWidth={2}
        dot={{ r: 4 }}
        activeDot={{ r: 8 }}
      />
    </LineChart>
  </ResponsiveContainer>
);

export default ChildAnalysis;
