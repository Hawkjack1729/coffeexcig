import React, { useEffect, useState } from "react";
import { Heart, Wifi, WifiOff } from "lucide-react";

interface OnlineStatusProps {
  userId: string;
  userEmail: string;
}

export const OnlineStatus: React.FC<OnlineStatusProps> = ({
  userId,
  userEmail,
}) => {
  const [partnerOnline, setPartnerOnline] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState("");
  const url = import.meta.env.VITE_API_URL;

  const updateStatus = async (isOnline: boolean) => {
    try {
      await fetch(`${url}/api/user-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isOnline }),
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const checkPartnerStatus = async () => {
    try {
      const response = await fetch(`${url}/api/partner-status/${userId}`);
      const data = await response.json();
      setPartnerOnline(data?.is_online || false);
    } catch (error) {
      console.error("Error checking partner status:", error);
    }
  };

  useEffect(() => {
    // Set user as online
    updateStatus(true);

    // Check partner status periodically
    const interval = setInterval(checkPartnerStatus, 10000);
    checkPartnerStatus();

    // Set user as offline when leaving
    const handleBeforeUnload = () => updateStatus(false);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      updateStatus(false);
    };
  }, [userId]);

  const getPartnerName = () => {
    if (userEmail === "me@example.com") return "She";
    if (userEmail === "her@example.com") return "You";
    return "Your love";
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border-2 border-pink-100 mb-6">
      <div className="flex items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          {partnerOnline ? (
            <>
              <div className="relative">
                <Heart
                  className="w-5 h-5 text-pink-500 animate-pulse\"
                  fill="currentColor"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
              </div>
              <span
                className="text-pink-600 font-medium"
                style={{ fontFamily: "Dancing Script, cursive" }}
              >
                {getPartnerName()} is online 💞
              </span>
            </>
          ) : (
            <>
              <Heart className="w-5 h-5 text-gray-400" />
              <span
                className="text-gray-500 font-medium"
                style={{ fontFamily: "Dancing Script, cursive" }}
              >
                {getPartnerName()} is away 💤
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

