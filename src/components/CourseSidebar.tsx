import { useState } from "react";
import { ChevronDown, CheckCircle2, PlayCircle, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Section, Video } from "@/data/courses";

interface CourseSidebarProps {
  sections: Section[];
  activeVideoId: string;
  completedVideos: Set<string>;
  onVideoSelect: (video: Video) => void;
}

const CourseSidebar = ({ sections, activeVideoId, completedVideos, onVideoSelect }: CourseSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.map((s) => s.id))
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  const totalVideos = sections.reduce((acc, s) => acc + s.videos.length, 0);
  const completedCount = completedVideos.size;
  const progressPercent = totalVideos > 0 ? (completedCount / totalVideos) * 100 : 0;

  return (
    <div className="flex h-full flex-col border-l border-sidebar-border bg-sidebar">
      {/* Header */}
      <div className="border-b border-sidebar-border p-4">
        <h2 className="font-display text-sm font-semibold text-sidebar-foreground">Course Content</h2>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sidebar-accent">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {completedCount}/{totalVideos}
          </span>
        </div>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto">
        {sections.map((section, sIndex) => {
          const sectionCompleted = section.videos.every((v) => completedVideos.has(v.id));
          const isExpanded = expandedSections.has(section.id);

          return (
            <div key={section.id} className="border-b border-sidebar-border">
              <button
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-sidebar-accent"
              >
                <div className="flex items-center gap-2">
                  {sectionCompleted && (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  )}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Section {sIndex + 1}
                    </p>
                    <p className="text-sm font-semibold text-sidebar-foreground">
                      {section.title}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {section.videos.map((video) => {
                      const isActive = video.id === activeVideoId;
                      const isCompleted = completedVideos.has(video.id);

                      return (
                        <button
                          key={video.id}
                          onClick={() => onVideoSelect(video)}
                          className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                            isActive
                              ? "bg-primary/10 border-l-2 border-primary"
                              : "hover:bg-sidebar-accent border-l-2 border-transparent"
                          }`}
                        >
                          <div className="shrink-0">
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            ) : isActive ? (
                              <PlayCircle className="h-4 w-4 text-primary" />
                            ) : (
                              <PlayCircle className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm truncate ${
                                isActive
                                  ? "font-semibold text-primary"
                                  : "text-sidebar-foreground"
                              }`}
                            >
                              {video.title}
                            </p>
                            <p className="text-xs text-muted-foreground">{video.duration}</p>
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseSidebar;
