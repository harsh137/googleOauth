import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "../screen/Home";
import Dashboard from "../screen/Dashboard";
import GmailDashboard from "../screen/GmailDashboard";
import DriveDashboard from "../screen/DriveDashboard";

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
