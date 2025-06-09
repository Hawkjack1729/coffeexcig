import React, { useState } from "react";
import { Heart, Lock } from "lucide-react";

interface SharedPasswordScreenProps {
  onValidPassword: () => void;
}

export const SharedPasswordScreen: React.FC<SharedPasswordScreenProps> = ({
  onValidPassword,
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const url = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${url}/api/validate-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sharedPassword: password }),
      });

      if (response.ok) {
        onValidPassword();
      } else {
        setError("Wrong password, my love 💔");
      }
    } catch (err) {
      setError("Something went wrong. Try again? 💕");
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
              <Lock className="w-6 h-6 text-pink-600 absolute -bottom-1 -right-1 bg-white rounded-full p-1" />
            </div>
          </div>
          <h1
            className="text-3xl font-bold text-gray-800 mb-2"
            style={{ fontFamily: "Dancing Script, cursive" }}
          >
            Our Secret Place
          </h1>
          <p className="text-pink-600 text-sm">
            Enter our special password to continue 💕
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Our secret password..."
              className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:border-pink-400 focus:outline-none transition-colors text-center text-lg"
              style={{ fontFamily: "Dancing Script, cursive" }}
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
            style={{ fontFamily: "Dancing Script, cursive" }}
          >
            {isLoading ? "Checking..." : "Unlock Our Love 💖"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          Made with 💕 for us
        </div>
      </div>
    </div>
  );
};

