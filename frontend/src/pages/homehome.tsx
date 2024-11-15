import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Smile, Users, BookOpen } from "lucide-react";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Smile,
      title: "Learn Emotions",
      description: "Discover feelings through fun activities",
    },
    {
      icon: Users,
      title: "Make Friends",
      description: "Connect with other amazing kids",
    },
    {
      icon: BookOpen,
      title: "Cool Stories",
      description: "Explore exciting tales and adventures",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-4 md:p-8">
      <header className="bg-white rounded-lg shadow-md p-4 mb-8">
        <nav className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-600 mb-4 md:mb-0">
            EmotiPlay
          </h1>
          <div className="space-y-2 md:space-y-0 md:space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate("/login")}
              className="w-full md:w-auto"
            >
              Log In
            </Button>
            <Button
              onClick={() => navigate("/register")}
              className="w-full md:w-auto bg-purple-500 hover:bg-purple-600"
            >
              Join the Fun!
            </Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto">
        <section className="text-center mb-12">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-purple-700 mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Welcome to EmotiPlay!
          </motion.h2>
          <p className="text-xl text-purple-600 mb-6">
            Let's explore feelings and have fun together!
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/register")}
            className="text-lg px-6 py-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
          >
            Start Your Adventure
          </Button>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-2 border-purple-200 hover:border-purple-400 transition-colors">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <feature.icon className="h-12 w-12 text-purple-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-purple-700">
                    {feature.title}
                  </h3>
                  <p className="text-purple-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="text-center bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-3xl font-bold text-purple-700 mb-4">
            Ready for an Emotion Adventure?
          </h2>
          <p className="text-lg text-purple-600 mb-6">
            Join EmotiPlay and start your exciting journey today!
          </p>
          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Button
              size="lg"
              onClick={() => navigate("/register")}
              className="w-full md:w-auto text-lg px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-purple-700"
            >
              Create Your Profile
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/login")}
              className="w-full md:w-auto text-lg px-6 py-3 text-purple-700 border-purple-400 hover:bg-purple-100"
            >
              I'm Already a Member
            </Button>
          </div>
        </section>
      </main>

      <footer className="mt-12 text-center">
        <p className="text-purple-700">
          &copy; 2024 EmotiPlay. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
