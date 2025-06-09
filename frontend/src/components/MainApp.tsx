import React, { useEffect, useState } from "react";
import { LogOut, Heart } from "lucide-react";
import { supabase } from "../lib/supabase";
import { AudioUpload } from "./AudioUpload";
import { Timeline } from "./Timeline";
import { OnlineStatus } from "./OnlineStatus";

interface MainAppProps {
  user: any;
  onSignOut: () => void;
}

export const MainApp: React.FC<MainAppProps> = ({ user, onSignOut }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onSignOut();
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border-2 border-pink-100 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart
                className="w-8 h-8 text-pink-500 animate-pulse"
                fill="currentColor"
              />
              <div>
                <h1
                  className="text-2xl font-bold text-gray-800"
                  style={{ fontFamily: "Dancing Script, cursive" }}
                >
                  Coffee X Cig Love Space
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {user.email.split("@")[0]} 💕
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-600 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Online Status */}
        <OnlineStatus userId={user.id} userEmail={user.email} />

        {/* Audio Upload */}
        <AudioUpload
          userId={user.id}
          userEmail={user.email}
          onUploadSuccess={handleUploadSuccess}
        />

        {/* Timeline */}
        <Timeline
          userId={user.id}
          userEmail={user.email}
          refreshTrigger={refreshTrigger}
        />
      </div>
    </div>
  );
};

