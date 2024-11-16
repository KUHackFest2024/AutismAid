import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChildDashboard from "./pages/ChildDashboard";
import EmotionLearning from "./pages/EmotionalLearning";
import CaretakerDashboard from "./pages/CaretakerDashboard";
import ChildAnalysis from "./pages/ChildAnalyis";
import EmotionMatchingGames from "./pages/EmotionMatchingGames";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/child-dashboard" element={<ChildDashboard />} />
          <Route path="/emotional-learning" element={<EmotionLearning />} />
          <Route path="/caretaker-dashboard" element={<CaretakerDashboard />} />
          <Route path="/child-analysis/:childId" element={<ChildAnalysis />} />
          <Route
            path="/emotion-matching-games"
            element={<EmotionMatchingGames />}
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
