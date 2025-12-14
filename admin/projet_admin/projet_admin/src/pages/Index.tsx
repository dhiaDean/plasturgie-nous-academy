
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center max-w-3xl px-4">
        <div className="mx-auto h-16 w-16 rounded-full bg-brand-purple flex items-center justify-center mb-6">
          <span className="text-white font-bold text-2xl">L</span>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
          <span className="text-brand-purple">Plasturgie-Nous Academy</span> Training Platform
        </h1>
        <p className="mt-5 text-xl text-gray-600">
          Manage your training center with ease. Access the dashboard to view courses,
          instructors, and student progress all in one place.
        </p>
        <div className="mt-8 flex justify-center">
          <Button 
            onClick={() => navigate("/login")}
            className="bg-brand-purple hover:bg-brand-dark-purple text-lg px-8 py-4"
          >
            Sign in to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
