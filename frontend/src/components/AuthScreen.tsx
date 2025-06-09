import React, { useState } from "react";
import { Heart, Mail } from "lucide-react";
import { supabase } from "../lib/supabase";

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const url = import.meta.env.VITE_API_URL;

  const validateEmail = async (email: string) => {
    const response = await fetch(`${url}/api/validate-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return response.ok;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate email first
      const isValidEmail = await validateEmail(email);
      if (!isValidEmail) {
        setError("This email is not authorized for our love app 💔");
        setIsLoading(false);
        return;
      }

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        setError("Check your email for verification link! 💌");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onAuthSuccess();
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong 💔");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md border-2 border-pink-100">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Heart
                className="w-16 h-16 text-pink-500 animate-pulse"
                fill="currentColor"
              />
              <Mail className="w-6 h-6 text-pink-600 absolute -bottom-1 -right-1 bg-white rounded-full p-1" />
            </div>
          </div>
          <h1
            className="text-3xl font-bold text-gray-800 mb-2"
            style={{ fontFamily: "Dancing Script, cursive" }}
          >
            {isSignUp ? "Join Our Love" : "Welcome Back"}
          </h1>
          <p className="text-pink-600 text-sm">
            {isSignUp
              ? "Create your account 💕"
              : "Sign in to our private space 💖"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address..."
              className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:border-pink-400 focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password..."
              className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:border-pink-400 focus:outline-none transition-colors"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-center text-sm bg-red-50 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white py-3 rounded-2xl font-semibold hover:from-pink-500 hover:to-rose-500 transition-all duration-300 disabled:opacity-50 shadow-lg"
          >
            {isLoading
              ? "Please wait..."
              : isSignUp
                ? "Create Account 💕"
                : "Sign In 💖"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-pink-600 hover:text-pink-700 text-sm underline"
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Need an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

