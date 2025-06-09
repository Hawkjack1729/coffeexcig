import React, { useEffect, useState } from 'react';
import { AudioPlayer } from './AudioPlayer';
import { supabase, Recording } from '../lib/supabase';
import { Heart, Music } from 'lucide-react';

interface TimelineProps {
  userId: string;
  userEmail: string;
  refreshTrigger: number;
}

export const Timeline: React.FC<TimelineProps> = ({ userId, userEmail, refreshTrigger }) => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecordings = async () => {
    try {
      const { data, error } = await supabase
        .from('recordings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecordings(data || []);
    } catch (error) {
      console.error('Error fetching recordings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (recordingId: string, emoji: string) => {
    try {
      const { error } = await supabase
        .from('reactions')
        .insert({
          recording_id: recordingId,
          user_id: userId,
          emoji,
        });

      if (error) throw error;
      fetchRecordings(); // Refresh to show new reaction
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  useEffect(() => {
    fetchRecordings();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin">
          <Heart className="w-8 h-8 text-pink-500\" fill="currentColor" />
        </div>
      </div>
    );
  }

  if (recordings.length === 0) {
    return (
      <div className="text-center py-12">
        <Music className="w-16 h-16 text-pink-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Dancing Script, cursive' }}>
          No messages yet
        </h3>
        <p className="text-gray-500">Share your first voice message to get started! 💕</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center" style={{ fontFamily: 'Dancing Script, cursive' }}>
        Our Love Messages 💕
      </h2>
      
      {recordings.map((recording) => (
        <AudioPlayer
          key={recording.id}
          audioUrl={recording.audio_url}
          caption={recording.caption}
          mood={recording.mood}
          userEmail={recording.user_email}
          createdAt={recording.created_at}
          isOwn={recording.user_id === userId}
          recordingId={recording.id}
          onReaction={handleReaction}
        />
      ))}
    </div>
  );
};