"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: string;
}

export default function VideoPlayer({ 
  src, 
  title, 
  description, 
  thumbnail, 
  duration: initialDuration 
}: VideoPlayerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [showControls, setShowControls] = React.useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      className="relative bg-black rounded-xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={thumbnail}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="w-full h-auto"
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      />

      {/* Overlay Controls */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Top Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <motion.button
            onClick={toggleMute}
            className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </motion.button>
          
          <motion.button
            className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Maximize className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.button
            onClick={togglePlay}
            className="p-4 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
          </motion.button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-4 left-4 right-4">
          {/* Progress Bar */}
          <div className="mb-2">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, white 0%, white ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) 100%)`
              }}
            />
          </div>

          {/* Time and Title */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <h3 className="text-sm font-medium">{title}</h3>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 