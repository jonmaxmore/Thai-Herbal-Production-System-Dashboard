
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HerbDashboard from "@/components/HerbDashboard";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userRole = localStorage.getItem("userRole");
    
    if (!userRole) {
      // If not logged in, redirect to login page
      navigate("/login");
    } else {
      // If logged in, redirect to dashboard
      navigate("/herb-trace/dashboard");
    }
  }, [navigate]);

  // This will only show briefly before redirect
  return <div className="p-8">Redirecting...</div>;
};

export default Index;
