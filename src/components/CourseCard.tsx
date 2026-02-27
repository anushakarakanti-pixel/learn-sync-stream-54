import { Star, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Course } from "@/data/courses";

interface CourseCardProps {
  course: Course;
  index: number;
}

const CourseCard = ({ course, index }: CourseCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link to={`/course/${course.id}`} className="group block">
        <div className="overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-glow hover:-translate-y-1">
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden bg-muted">
            <div className="gradient-primary absolute inset-0 opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-card/20 p-4 backdrop-blur-sm transition-transform group-hover:scale-110">
                <svg className="h-8 w-8 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-2 right-2 rounded-md bg-player/80 px-2 py-1 text-xs font-medium text-player-foreground backdrop-blur-sm">
              {course.totalDuration}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="mb-1 font-display text-base font-semibold leading-tight text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {course.title}
            </h3>
            <p className="mb-3 text-sm text-muted-foreground">{course.instructor}</p>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-foreground">{course.rating}</span>
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {(course.students / 1000).toFixed(1)}k
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {course.totalLessons} lessons
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;
