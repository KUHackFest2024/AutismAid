import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { useAuth } from "../contexts/AuthContext";
import { Loader2 } from "lucide-react";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const { setUser } = useAuth();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulate a short delay for login process
    setTimeout(() => {
      if (email === "child@gmail.com" && password === "child123") {
        // setUser({
        //   id: "child1",
        //   name: "Child User",
        //   email: "child@gmail.com",
        // });
        // localStorage.setItem(
        //   "user",
        //   JSON.stringify({
        //     id: "child1",
        //     name: "Child User",
        //     email: "child@gmail.com",
        //   })
        // );
        navigate("/child-dashboard");
      } else if (
        email === "caretaker@gmail.com" &&
        password === "caretaker123"
      ) {
        navigate("/caretaker-dashboard");
      } else {
        setError("Invalid email or password");
      }
      setIsLoading(false);
    }, 1000); // 1 second delay to simulate login process
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-purple-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-purple-700">
              Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-purple-600">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="border-purple-200 focus:border-purple-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-purple-600">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    className="border-purple-200 focus:border-purple-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <CardFooter className="flex flex-col space-y-2 px-0 pt-6">
                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Log In"
                  )}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-purple-600">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 text-purple-700"
                onClick={() => navigate("/register")}
              >
                Register here
              </Button>
            </div>
          </CardFooter>
        </Card>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
