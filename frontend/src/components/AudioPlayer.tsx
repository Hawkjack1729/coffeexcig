import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Heart, MessageCircle } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  caption?: string;
  mood: string;
  userEmail: string;
  createdAt: string;
  isOwn: boolean;
  recordingId: string;
  onReaction: (recordingId: string, emoji: string) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  caption,
  mood,
  userEmail,
  createdAt,
  isOwn,
  recordingId,
  onReaction,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showReactions, setShowReactions] = useState(false);

  const reactions = ['❤️', '💕', '💖', '😘', '🥰', '😍'];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const date = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs sm:max-w-md p-4 rounded-3xl shadow-lg ${
          isOwn
            ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white'
            : 'bg-white text-gray-800 border-2 border-pink-100'
        }`}
      >
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              isOwn ? 'bg-white/20' : 'bg-pink-100 text-pink-800'
            }`}>
              {mood}
            </div>
          </div>
          <span className={`text-xs ${isOwn ? 'text-white/70' : 'text-gray-500'}`}>
            {date}
          </span>
        </div>

        {/* Caption */}
        {caption && (
          <p className={`mb-3 text-sm ${isOwn ? 'text-white/90' : 'text-gray-700'}`}>
            {caption}
          </p>
        )}

        {/* Audio Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-105 ${
              isOwn
                ? 'bg-white/20 hover:bg-white/30'
                : 'bg-pink-100 hover:bg-pink-200'
            }`}
          >
            {isPlaying ? (
              <Pause className={`w-5 h-5 ${isOwn ? 'text-white' : 'text-pink-600'}`} />
            ) : (
              <Play className={`w-5 h-5 ${isOwn ? 'text-white' : 'text-pink-600'}`} />
            )}
          </button>

          <div className="flex-1">
            <div className={`w-full h-2 rounded-full ${
              isOwn ? 'bg-white/20' : 'bg-pink-100'
            }`}>
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  isOwn ? 'bg-white' : 'bg-pink-400'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className={isOwn ? 'text-white/70' : 'text-gray-500'}>
                {formatTime(currentTime)}
              </span>
              <span className={isOwn ? 'text-white/70' : 'text-gray-500'}>
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Reaction Button */}
        {!isOwn && (
          <div className="mt-3 flex justify-end relative">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="p-2 rounded-full bg-pink-100 hover:bg-pink-200 transition-colors"
            >
              <Heart className="w-4 h-4 text-pink-600" />
            </button>
            
            {showReactions && (
              <div className="absolute bottom-full right-0 mb-2 bg-white rounded-2xl shadow-lg p-2 flex gap-1">
                {reactions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onReaction(recordingId, emoji);
                      setShowReactions(false);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};