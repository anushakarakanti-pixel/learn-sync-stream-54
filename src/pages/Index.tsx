import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Sparkles, Search, PlayCircle, BarChart3, RotateCcw, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import CourseCard from "@/components/CourseCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables } from "@/integrations/supabase/types";

const howItWorksSteps = [
  {
    icon: PlayCircle,
    title: "Pick a Course",
    description: "Browse our library and choose from dozens of expert-led courses across development, design, and data science.",
    action: "browse" as const,
  },
  {
    icon: BarChart3,
    title: "Learn at Your Pace",
    description: "Watch video lessons anytime. Your progress is saved automatically — pause and resume exactly where you left off.",
    action: "learn" as const,
  },
  {
    icon: RotateCcw,
    title: "Resume Anytime",
    description: "Come back days later and pick up right where you stopped. Your progress syncs across all your devices instantly.",
    action: "resume" as const,
  },
];

const Index = () => {
  const [courses, setCourses] = useState<Tables<"courses">[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const howItWorksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase.from("courses").select("*").order("students", { ascending: false });
      if (data) setCourses(data);
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.instructor ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#courses"
                className="gradient-primary rounded-lg px-6 py-3 font-semibold text-primary-foreground transition-all hover:opacity-90 shadow-glow"
              >
                Explore Courses
              </a>
              <button
                onClick={scrollToHowItWorks}
                className="rounded-lg border border-border bg-card px-6 py-3 font-semibold text-card-foreground transition-colors hover:bg-secondary"
              >
                How it works
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={howItWorksRef} className="border-b border-border bg-muted/50 py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              How it works
            </h2>
            <p className="mt-3 text-muted-foreground">
              Three simple steps to start learning today
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {howItWorksSteps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="rounded-xl border border-border bg-card p-6 text-center transition-all hover:shadow-glow hover:-translate-y-1"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary">
                  <step.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-card-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section id="courses" className="container py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl font-bold text-foreground">Popular Courses</h2>
            <span className="ml-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {filteredCourses.length}
            </span>
          </div>

          {/* Search */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, instructors..."
              className="w-full rounded-lg border border-input bg-card py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Search className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-lg font-medium text-muted-foreground">No courses found</p>
            <p className="mt-1 text-sm text-muted-foreground/70">Try adjusting your search query</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
