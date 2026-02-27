import { motion } from "framer-motion";
import { TrendingUp, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import CourseCard from "@/components/CourseCard";
import { mockCourses } from "@/data/courses";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        <div className="container relative py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              New courses added weekly
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
              Learn without{" "}
              <span className="text-gradient">limits</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              Pick up where you left off. Resume any lesson instantly with smart progress tracking.
            </p>
            <div className="mt-8 flex gap-3">
              <button className="gradient-primary rounded-lg px-6 py-3 font-semibold text-primary-foreground transition-all hover:opacity-90 shadow-glow">
                Explore Courses
              </button>
              <button className="rounded-lg border border-border bg-card px-6 py-3 font-semibold text-card-foreground transition-colors hover:bg-secondary">
                How it works
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="container py-12">
        <div className="mb-8 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="font-display text-2xl font-bold text-foreground">Popular Courses</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mockCourses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
