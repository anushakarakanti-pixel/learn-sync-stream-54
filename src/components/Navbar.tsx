import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Play, LogOut, User, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b border-nav-border bg-nav/80 backdrop-blur-xl"
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-lg">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">LearnFlow</span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/certificates"
                className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Award className="h-4 w-4" />
                <span className="hidden sm:inline">Certificates</span>
              </Link>
              <span className="hidden text-sm text-muted-foreground md:inline">
                <User className="mr-1 inline h-4 w-4" />
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="gradient-primary flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
            >
              <Play className="h-4 w-4" />
              Get Started
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
