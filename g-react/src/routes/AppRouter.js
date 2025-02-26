import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "../components/Home";
import Dashboard from "../components/Dashboard";
import GmailDashboard from "../components/GmailDashboard";
import DriveDashboard from "../components/DriveDashboard";

// function PrivateRoute({ children }) {
//   return localStorage.getItem("auth") ? children : <Navigate to="/" />;
// }

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/gmail" element={<GmailDashboard />} />
        <Route path="/drive" element={<DriveDashboard />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
