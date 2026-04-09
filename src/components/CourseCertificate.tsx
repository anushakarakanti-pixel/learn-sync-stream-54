import { useState, useRef } from "react";
import { Award, Download, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CourseCertificateProps {
  courseTitle: string;
  courseId: string;
  userId: string;
  userName: string;
  totalLessons: number;
  completedCount: number;
}

const CourseCertificate = ({
  courseTitle,
  courseId,
  userId,
  userName,
  totalLessons,
  completedCount,
}: CourseCertificateProps) => {
  const [certificate, setCertificate] = useState<{
    certificate_number: string;
    issued_at: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const isComplete = totalLessons > 0 && completedCount >= totalLessons;
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const handleGenerateCertificate = async () => {
    setLoading(true);
    try {
      // Check if certificate already exists
      const { data: existing } = await supabase
        .from("certificates")
        .select("certificate_number, issued_at")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .maybeSingle();

      if (existing) {
        setCertificate(existing);
        toast.success("Certificate loaded!");
      } else {
        const { data, error } = await supabase
          .from("certificates")
          .insert({ user_id: userId, course_id: courseId })
          .select("certificate_number, issued_at")
          .single();

        if (error) throw error;
        setCertificate(data);
        toast.success("Certificate generated! 🎉");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate certificate");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!certRef.current) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 850;

    // Background
    const grad = ctx.createLinearGradient(0, 0, 1200, 850);
    grad.addColorStop(0, "#1a1040");
    grad.addColorStop(0.5, "#2d1b69");
    grad.addColorStop(1, "#1a3a4a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 850);

    // Border
    ctx.strokeStyle = "#a78bfa";
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, 1140, 790);
    ctx.strokeStyle = "#5eead4";
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, 1120, 770);

    // Title
    ctx.fillStyle = "#a78bfa";
    ctx.font = "16px 'DM Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("LEARNFLOW", 600, 100);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px 'Space Grotesk', sans-serif";
    ctx.fillText("Certificate of Completion", 600, 160);

    // Decorative line
    ctx.strokeStyle = "#5eead4";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(350, 185);
    ctx.lineTo(850, 185);
    ctx.stroke();

    // Body
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "18px 'DM Sans', sans-serif";
    ctx.fillText("This is to certify that", 600, 260);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px 'Space Grotesk', sans-serif";
    ctx.fillText(userName || "Student", 600, 320);

    ctx.fillStyle = "#c4b5fd";
    ctx.font = "18px 'DM Sans', sans-serif";
    ctx.fillText("has successfully completed the course", 600, 390);

    ctx.fillStyle = "#5eead4";
    ctx.font = "bold 28px 'Space Grotesk', sans-serif";
    const maxWidth = 900;
    const titleText = courseTitle;
    if (ctx.measureText(titleText).width > maxWidth) {
      ctx.font = "bold 22px 'Space Grotesk', sans-serif";
    }
    ctx.fillText(titleText, 600, 450);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px 'DM Sans', sans-serif";
    ctx.fillText(`${totalLessons} lessons completed`, 600, 500);

    // Certificate info
    if (certificate) {
      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px 'DM Sans', sans-serif";
      ctx.fillText(
        `Issued: ${new Date(certificate.issued_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`,
        400,
        620
      );
      ctx.fillText(`Certificate No: ${certificate.certificate_number}`, 800, 620);
    }

    // Award icon placeholder
    ctx.fillStyle = "#a78bfa";
    ctx.beginPath();
    ctx.arc(600, 570, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1040";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("★", 600, 578);

    // Footer
    ctx.strokeStyle = "#a78bfa33";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, 680);
    ctx.lineTo(1100, 680);
    ctx.stroke();

    ctx.fillStyle = "#64748b";
    ctx.font = "12px 'DM Sans', sans-serif";
    ctx.fillText("LearnFlow • Online Learning Platform", 600, 720);

    // Download
    const link = document.createElement("a");
    link.download = `certificate-${courseTitle.replace(/\s+/g, "-").toLowerCase()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("Certificate downloaded!");
  };

  // Not complete yet — show progress
  if (!isComplete) {
    return (
      <div className="border border-border rounded-xl bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Award className="h-6 w-6 text-muted-foreground" />
          <h3 className="font-display text-lg font-bold text-foreground">Course Certificate</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Complete all lessons to earn your certificate.
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            {completedCount}/{totalLessons} lessons
          </span>
        </div>
      </div>
    );
  }

  // Completed — show certificate section
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-primary/30 rounded-xl bg-card p-6 shadow-glow"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-full gradient-primary p-2">
          <Award className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">
            🎉 Congratulations!
          </h3>
          <p className="text-sm text-muted-foreground">
            You've completed all {totalLessons} lessons
          </p>
        </div>
      </div>

      {!certificate ? (
        <Button
          onClick={handleGenerateCertificate}
          disabled={loading}
          className="w-full gradient-primary text-primary-foreground hover:opacity-90"
        >
          {loading ? "Generating..." : "Generate Certificate"}
        </Button>
      ) : (
        <div className="space-y-4">
          {/* Certificate preview */}
          <div
            ref={certRef}
            className="relative rounded-lg overflow-hidden p-8 text-center"
            style={{
              background: "linear-gradient(135deg, #1a1040, #2d1b69, #1a3a4a)",
            }}
          >
            <div className="border-2 border-primary/40 rounded-lg p-6 relative">
              <div className="absolute inset-0 border border-accent/20 rounded-lg m-1" />
              <p className="text-xs tracking-[0.3em] text-primary/80 uppercase mb-1">
                LearnFlow
              </p>
              <h4 className="font-display text-xl font-bold text-white mb-1">
                Certificate of Completion
              </h4>
              <div className="w-24 h-0.5 mx-auto bg-accent/60 mb-4" />
              <p className="text-xs text-primary-foreground/60 mb-1">This certifies that</p>
              <p className="font-display text-lg font-bold text-white mb-1">
                {userName || "Student"}
              </p>
              <p className="text-xs text-primary-foreground/60 mb-1">
                has completed the course
              </p>
              <p className="font-display text-sm font-semibold text-accent mb-3">
                {courseTitle}
              </p>
              <div className="flex items-center justify-center gap-1 mb-3">
                <CheckCircle className="h-4 w-4 text-accent" />
                <span className="text-xs text-primary-foreground/50">
                  {totalLessons} lessons
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-primary-foreground/40 px-2">
                <span>
                  {new Date(certificate.issued_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span>{certificate.certificate_number}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleDownload}
            variant="outline"
            className="w-full gap-2"
          >
            <Download className="h-4 w-4" />
            Download Certificate
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default CourseCertificate;
