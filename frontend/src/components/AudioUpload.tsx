import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Mic, Upload, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AudioUploadProps {
  userId: string;
  userEmail: string;
  onUploadSuccess: () => void;
}

const MOODS = [
  { emoji: '😘', label: 'Loving', color: 'bg-pink-100 text-pink-800' },
  { emoji: '🥰', label: 'Sweet', color: 'bg-rose-100 text-rose-800' },
  { emoji: '😊', label: 'Happy', color: 'bg-yellow-100 text-yellow-800' },
  { emoji: '🤗', label: 'Warm', color: 'bg-orange-100 text-orange-800' },
  { emoji: '😴', label: 'Sleepy', color: 'bg-purple-100 text-purple-800' },
  { emoji: '🎵', label: 'Musical', color: 'bg-blue-100 text-blue-800' },
];

export const AudioUpload: React.FC<AudioUploadProps> = ({ userId, userEmail, onUploadSuccess }) => {
  const [caption, setCaption] = useState('');
  const [selectedMood, setSelectedMood] = useState(MOODS[0]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      setError('Please upload an audio file 🎵');
      return;
    }

    setIsUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `recordings/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('audio-recordings')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('audio-recordings')
        .getPublicUrl(filePath);

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('recordings')
        .insert({
          user_id: userId,
          user_email: userEmail,
          audio_url: data.publicUrl,
          caption: caption || null,
          mood: `${selectedMood.emoji} ${selectedMood.label}`,
        });

      if (dbError) throw dbError;

      setCaption('');
      onUploadSuccess();
    } catch (err: any) {
      setError(err.message || 'Upload failed 💔');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [userId, userEmail, caption, selectedMood, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/*': ['.mp3', '.wav', '.m4a', '.ogg'] },
    multiple: false,
  });

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border-2 border-pink-100 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2" style={{ fontFamily: 'Dancing Script, cursive' }}>
        <Heart className="w-5 h-5 text-pink-500" fill="currentColor" />
        Share a Voice Message
      </h3>

      <div className="space-y-4">
        {/* Mood Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
          <div className="grid grid-cols-3 gap-2">
            {MOODS.map((mood) => (
              <button
                key={mood.label}
                onClick={() => setSelectedMood(mood)}
                className={`p-2 rounded-lg text-sm font-medium transition-all ${
                  selectedMood.label === mood.label
                    ? mood.color + ' ring-2 ring-pink-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {mood.emoji} {mood.label}
              </button>
            ))}
          </div>
        </div>

        {/* Caption */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Caption (optional)</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add a sweet message..."
            className="w-full px-3 py-2 border-2 border-pink-200 rounded-lg focus:border-pink-400 focus:outline-none transition-colors"
            maxLength={100}
          />
        </div>

        {/* File Upload */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-pink-400 bg-pink-50'
              : 'border-pink-200 hover:border-pink-300 hover:bg-pink-25'
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-2">
            {isUploading ? (
              <div className="animate-spin mx-auto w-8 h-8">
                <Mic className="w-8 h-8 text-pink-500" />
              </div>
            ) : (
              <Upload className="w-8 h-8 text-pink-500 mx-auto" />
            )}
            <p className="text-gray-600">
              {isUploading
                ? 'Uploading your love message...'
                : isDragActive
                ? 'Drop your audio file here 💕'
                : 'Drag & drop an audio file, or click to select'}
            </p>
            {isUploading && (
              <div className="w-full bg-pink-200 rounded-full h-2">
                <div
                  className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-center text-sm bg-red-50 py-2 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};