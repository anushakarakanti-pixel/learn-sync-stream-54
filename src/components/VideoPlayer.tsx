import { useRef, useEffect, useCallback } from "react";

interface VideoPlayerProps {
  videoUrl: string;
  startTime?: number;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
}

const VideoPlayer = ({ videoUrl, startTime = 0, onTimeUpdate, onEnded }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSaveRef = useRef(0);
  const hasSetStartTime = useRef(false);

  // Set start time when video loads
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current && startTime > 0 && !hasSetStartTime.current) {
      videoRef.current.currentTime = startTime;
      hasSetStartTime.current = true;
    }
  }, [startTime]);

  // Reset flag when video URL changes
  useEffect(() => {
    hasSetStartTime.current = false;
  }, [videoUrl]);

  // Save progress every 5 seconds
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current || !onTimeUpdate) return;
    const now = Date.now();
    if (now - lastSaveRef.current >= 5000) {
      lastSaveRef.current = now;
      onTimeUpdate(videoRef.current.currentTime);
    }
  }, [onTimeUpdate]);

  // Save on pause too
  const handlePause = useCallback(() => {
    if (videoRef.current && onTimeUpdate) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  }, [onTimeUpdate]);

  const handleEnded = useCallback(() => {
    if (videoRef.current && onTimeUpdate) {
      onTimeUpdate(videoRef.current.currentTime);
    }
    onEnded?.();
  }, [onTimeUpdate, onEnded]);

  // Save progress on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && onTimeUpdate) {
        onTimeUpdate(videoRef.current.currentTime);
      }
    };
  }, [onTimeUpdate]);

  const handleError = useCallback(() => {
    console.error("Video failed to load:", videoUrl);
  }, [videoUrl]);

  // Try to play when loaded
  const handleCanPlay = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked, user needs to click play
        console.log("Autoplay blocked, user must click play");
      });
    }
  }, []);

  return (
    <div className="relative aspect-video w-full bg-player">
      <video
        ref={videoRef}
        key={videoUrl}
        src={videoUrl}
        controls
        playsInline
        crossOrigin="anonymous"
        className="h-full w-full"
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleCanPlay}
        onTimeUpdate={handleTimeUpdate}
        onPause={handlePause}
        onEnded={handleEnded}
        onError={handleError}
      />
    </div>
  );
};

export default VideoPlayer;
