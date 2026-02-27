import { useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, ChevronLeft, PanelRightOpen, PanelRightClose } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mockCourses } from "@/data/courses";
import CourseSidebar from "@/components/CourseSidebar";
import type { Video } from "@/data/courses";

const CoursePage = () => {
  const { id } = useParams();
  const course = mockCourses.find((c) => c.id === id);

  const allVideos = course?.sections.flatMap((s) => s.videos) ?? [];
  const [activeVideo, setActiveVideo] = useState<Video | null>(allVideos[0] ?? null);
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentIndex = allVideos.findIndex((v) => v.id === activeVideo?.id);

  const handleVideoSelect = useCallback((video: Video) => {
    setActiveVideo(video);
  }, []);

  const handleMarkComplete = () => {
    if (!activeVideo) return;
    setCompletedVideos((prev) => {
      const next = new Set(prev);
      next.add(activeVideo.id);
      return next;
    });
    // Auto-advance
    if (currentIndex < allVideos.length - 1) {
      setActiveVideo(allVideos[currentIndex + 1]);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) setActiveVideo(allVideos[currentIndex - 1]);
  };

  const goToNext = () => {
    if (currentIndex < allVideos.length - 1) setActiveVideo(allVideos[currentIndex + 1]);
  };

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
        {/* Video area */}
        <div className="flex flex-1 flex-col">
          {/* Video player placeholder */}
          <div className="relative flex aspect-video w-full items-center justify-center bg-player">
            <div className="absolute inset-0 gradient-primary opacity-10" />
            <div className="z-10 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 backdrop-blur-sm">
                <svg className="h-10 w-10 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-lg font-display font-semibold text-player-foreground">
                {activeVideo?.title}
              </p>
              <p className="mt-1 text-sm text-player-foreground/60">
                {activeVideo?.duration}
              </p>
            </div>
          </div>

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
