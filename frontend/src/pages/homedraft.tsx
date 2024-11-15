import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Users, Book, ArrowRight } from "lucide-react";

import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
}

const Home: React.FC = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const navigate = useNavigate();

  const features: Feature[] = [
    {
      icon: Brain,
      title: "Emotion Recognition",
      description:
        "Interactive tools to help understand and recognize emotions",
    },
    {
      icon: Users,
      title: "Caretaker Support",
      description: "Dedicated dashboard for caretakers to monitor and assist",
    },
    {
      icon: Book,
      title: "Learning Resources",
      description:
        "Curated content to support autism education and development",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">AutismConnect</h1>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => navigate("/login")}>
              Log In
            </Button>
            <Button onClick={() => navigate("/register")}>Register</Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Supporting Autism Journey
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Empowering individuals with autism and their caretakers through
            interactive tools and resources
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-6"
            onClick={() => navigate("/register")}
          >
            Get Started <ArrowRight className="ml-2" />
          </Button>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden">
              <div className="p-6">
                <motion.div
                  initial={false}
                  animate={{ scale: hoveredFeature === index ? 1.1 : 1 }}
                  className="mb-4"
                >
                  <feature.icon className="h-12 w-12 text-blue-500" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
              <motion.div
                className="absolute inset-0 bg-blue-100 opacity-0"
                initial={false}
                animate={{ opacity: hoveredFeature === index ? 0.2 : 0 }}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
              />
            </Card>
          ))}
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to join our community?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start your journey with AutismConnect today and access a world of
            support.
          </p>
          <div className="space-x-4">
            <Button size="lg" onClick={() => navigate("/register")}>
              Create an Account
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/login")}
            >
              Log In
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 AutismConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
