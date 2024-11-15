import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Dummy data for children
const children = [
  {
    id: 1,
    name: "Emily",
    age: 7,
    gender: "female",
    diagnosis: "High-functioning Autism",
    strengths: ["Visual learning", "Memory skills", "Musical aptitude"],
    challenges: [
      "Social interaction",
      "Sensory sensitivities",
      "Adapting to change",
    ],
  },
  {
    id: 2,
    name: "Michael",
    age: 9,
    gender: "male",
    diagnosis: "Asperger's Syndrome",
    strengths: ["Logical thinking", "Attention to detail", "Technical skills"],
    challenges: [
      "Emotional expression",
      "Nonverbal communication",
      "Flexibility in thinking",
    ],
  },
  {
    id: 3,
    name: "Sophia",
    age: 6,
    gender: "female",
    diagnosis: "Mild Autism",
    strengths: ["Creativity", "Pattern recognition", "Verbal skills"],
    challenges: [
      "Motor coordination",
      "Anxiety in social situations",
      "Sensory processing",
    ],
  },
  {
    id: 4,
    name: "Daniel",
    age: 8,
    gender: "male",
    diagnosis: "Moderate Autism",
    strengths: ["Mathematical ability", "Visual-spatial skills", "Honesty"],
    challenges: [
      "Verbal communication",
      "Understanding social cues",
      "Self-regulation",
    ],
  },
  {
    id: 5,
    name: "Olivia",
    age: 7,
    gender: "female",
    diagnosis: "PDD-NOS",
    strengths: ["Artistic talent", "Empathy", "Memory for facts"],
    challenges: [
      "Executive functioning",
      "Sensory overload",
      "Maintaining friendships",
    ],
  },
  {
    id: 6,
    name: "Ethan",
    age: 10,
    gender: "male",
    diagnosis: "High-functioning Autism",
    strengths: ["Problem-solving", "Focus on interests", "Analytical thinking"],
    challenges: ["Emotional regulation", "Adapting to change", "Motor skills"],
  },
];

const CaretakerDashboard: React.FC = () => {
  const navigate = useNavigate();

  const viewDetails = (child: (typeof children)[0]) => {
    navigate(`/child-analysis/${child.id}`, { state: child });
  };

  const getProfileImage = (gender: string) => {
    return gender === "female"
      ? "/placeholder.svg?height=100&width=100&text=F"
      : "/placeholder.svg?height=100&width=100&text=M";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-8">
      <motion.h1
        className="text-4xl font-bold text-center text-purple-700 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Caretaker Dashboard
      </motion.h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {children.map((child, index) => (
          <motion.div
            key={child.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full border-2 border-purple-200 hover:border-purple-400 transition-colors">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-purple-300">
                  <img
                    src={getProfileImage(child.gender)}
                    alt={`${child.name}'s avatar`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-purple-700">
                  {child.name}
                </h3>
                <p className="text-sm text-purple-600 mb-4">Age: {child.age}</p>
                <Button
                  onClick={() => viewDetails(child)}
                  className="mt-auto bg-green-500 hover:bg-green-600 text-white"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CaretakerDashboard;
