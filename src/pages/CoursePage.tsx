import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, ChevronLeft, PanelRightOpen, PanelRightClose, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import CourseSidebar from "@/components/CourseSidebar";
import VideoPlayer from "@/components/VideoPlayer";
import CourseCertificate from "@/components/CourseCertificate";
import { saveProgress, getProgress, getAllProgress } from "@/lib/progress";
import type { Tables } from "@/integrations/supabase/types";

type Section = Tables<"sections"> & { videos: Tables<"videos">[] };
type CourseWithSections = Tables<"courses"> & { sections: Section[] };

const CoursePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState<CourseWithSections | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<Tables<"videos"> | null>(null);
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [startTime, setStartTime] = useState(0);

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      const { data: courseData } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id!)
        .single();

      if (!courseData) { setLoading(false); return; }

      const { data: sectionsData } = await supabase
        .from("sections")
        .select("*")
        .eq("course_id", id!)
        .order("order_index");

      const sections: Section[] = [];
      for (const section of sectionsData ?? []) {
        const { data: videosData } = await supabase
          .from("videos")
          .select("*")
          .eq("section_id", section.id)
          .order("order_index");
        sections.push({ ...section, videos: videosData ?? [] });
      }

      const fullCourse: CourseWithSections = { ...courseData, sections };
      setCourse(fullCourse);

      // Load user progress
      if (user) {
        const progress = await getAllProgress(user.id);
        const completed = new Set(
          progress.filter((p) => p.completed).map((p) => p.video_id)
        );
        setCompletedVideos(completed);

        // Find last watched video or first video
        const allVideos = sections.flatMap((s) => s.videos);
        const lastProgress = progress
          .filter((p) => !p.completed && p.last_watched > 0)
          .sort((a, b) => b.last_watched - a.last_watched)[0];

        if (lastProgress) {
          const lastVideo = allVideos.find((v) => v.id === lastProgress.video_id);
          if (lastVideo) {
            setActiveVideo(lastVideo);
            setStartTime(lastProgress.last_watched);
          } else {
            setActiveVideo(allVideos[0] ?? null);
          }
        } else {
          setActiveVideo(allVideos[0] ?? null);
        }
      } else {
        const allVideos = sections.flatMap((s) => s.videos);
        setActiveVideo(allVideos[0] ?? null);
      }

      setLoading(false);
    };

    if (id) fetchCourse();
  }, [id, user]);

  const allVideos = course?.sections.flatMap((s) => s.videos) ?? [];
  const currentIndex = allVideos.findIndex((v) => v.id === activeVideo?.id);

  const handleVideoSelect = useCallback(async (video: Tables<"videos">) => {
    // Save current progress before switching
    if (user && activeVideo) {
      // Progress is saved by VideoPlayer on pause/unmount
    }
    setActiveVideo(video);
    // Load resume time for new video
    if (user) {
      const progress = await getProgress(user.id, video.id);
      setStartTime(progress?.completed ? 0 : (progress?.last_watched ?? 0));
    } else {
      setStartTime(0);
    }
  }, [user, activeVideo]);

  const handleTimeUpdate = useCallback((currentTime: number) => {
    if (user && activeVideo) {
      saveProgress(user.id, activeVideo.id, currentTime);
    }
  }, [user, activeVideo]);

  const handleVideoEnded = useCallback(() => {
    if (user && activeVideo) {
      saveProgress(user.id, activeVideo.id, 0, true);
      setCompletedVideos((prev) => new Set(prev).add(activeVideo.id));
    }
    // Auto-advance
    if (currentIndex < allVideos.length - 1) {
      const nextVideo = allVideos[currentIndex + 1];
      setActiveVideo(nextVideo);
      setStartTime(0);
    }
  }, [user, activeVideo, currentIndex, allVideos]);

  const handleMarkComplete = () => {
    if (!activeVideo) return;
    if (user) {
      saveProgress(user.id, activeVideo.id, 0, true);
    }
    setCompletedVideos((prev) => new Set(prev).add(activeVideo.id));
    if (currentIndex < allVideos.length - 1) {
      const nextVideo = allVideos[currentIndex + 1];
      setActiveVideo(nextVideo);
      setStartTime(0);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setActiveVideo(allVideos[currentIndex - 1]);
      setStartTime(0);
    }
  };

  const goToNext = () => {
    if (currentIndex < allVideos.length - 1) {
      setActiveVideo(allVideos[currentIndex + 1]);
      setStartTime(0);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-player">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Course not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-player">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-sidebar-border bg-sidebar px-4 py-2">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-sidebar-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="h-4 w-px bg-sidebar-border" />
          <h1 className="text-sm font-medium text-sidebar-foreground truncate max-w-md">
            {course.title}
          </h1>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-md p-2 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          {sidebarOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col">
          {/* Video player */}
          {activeVideo?.video_url ? (
            <VideoPlayer
              videoUrl={activeVideo.video_url}
              startTime={startTime}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
            />
          ) : (
            <div className="relative flex aspect-video w-full items-center justify-center bg-player">
              <p className="text-player-foreground/60">No video available</p>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between border-t border-sidebar-border bg-sidebar px-4 py-3">
            <button
              onClick={goToPrev}
              disabled={currentIndex <= 0}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <button
              onClick={handleMarkComplete}
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
                completedVideos.has(activeVideo?.id ?? "")
                  ? "bg-success/10 text-success"
                  : "gradient-primary text-primary-foreground hover:opacity-90"
              }`}
            >
              {completedVideos.has(activeVideo?.id ?? "") ? "✓ Completed" : "Mark Complete"}
            </button>

            <button
              onClick={goToNext}
              disabled={currentIndex >= allVideos.length - 1}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Video info */}
          <div className="flex-1 overflow-y-auto bg-background p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
              <h2 className="font-display text-xl font-bold text-foreground">{activeVideo?.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{course.description}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <span>Lesson {currentIndex + 1} of {allVideos.length}</span>
                <span>•</span>
                <span>{activeVideo?.duration}</span>
                {!user && (
                  <>
                    <span>•</span>
                    <Link to="/auth" className="text-primary hover:underline">Sign in to save progress</Link>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="shrink-0 overflow-hidden"
            >
              <CourseSidebar
                sections={course.sections}
                activeVideoId={activeVideo?.id ?? ""}
                completedVideos={completedVideos}
                onVideoSelect={handleVideoSelect}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CoursePage;
