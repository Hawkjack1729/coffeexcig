import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { BackgroundAnimation } from "./components/BackgroundAnimation";
import { SharedPasswordScreen } from "./components/SharedPasswordScreen";
import { AuthScreen } from "./components/AuthScreen";
import { MainApp } from "./components/MainApp";

function App() {
  const [user, setUser] = useState(null);
  const [passwordValid, setPasswordValid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handlePasswordValidation = () => {
    setPasswordValid(true);
  };

  const handleAuthSuccess = () => {
    // User state will be updated by the auth listener
  };

  const handleSignOut = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BackgroundAnimation />
        <div className="animate-spin">
          <span className="text-4xl">💖</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <BackgroundAnimation />

      <div className="relative z-10">
        {!passwordValid ? (
          <SharedPasswordScreen onValidPassword={handlePasswordValidation} />
        ) : !user ? (
          <AuthScreen onAuthSuccess={handleAuthSuccess} />
        ) : (
          <MainApp user={user} onSignOut={handleSignOut} />
        )}
      </div>
    </div>
  );
}

export default App;

