import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/register";
import ChildDashboard from "./pages/ChildDashboard";
import EmotionLearning from "./pages/EmotionalLearning";
import CaretakerDashboard from "./pages/CaretakerDashboard";
import ChildAnalysis from "./pages/ChildAnalyis";
import EmotionMatchingGames from "./pages/EmotionMatchingGames";

function App() {
  return (
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
  );
}

export default App;
