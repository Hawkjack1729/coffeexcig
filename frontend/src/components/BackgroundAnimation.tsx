import React, { useEffect, useState } from 'react';

interface Heart {
  id: number;
  left: number;
  delay: number;
  duration: number;
}

export const BackgroundAnimation: React.FC = () => {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const heartArray: Heart[] = [];
    for (let i = 0; i < 15; i++) {
      heartArray.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
      });
    }
    setHearts(heartArray);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute text-pink-200 opacity-20 animate-bounce"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
            fontSize: Math.random() * 20 + 10,
          }}
        >
          💖
        </div>
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-pink-100/20 via-transparent to-purple-100/20" />
    </div>
  );
};