import { useEffect, useState } from "react";
import { Award, Download, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CertificateWithCourse {
  id: string;
  certificate_number: string;
  issued_at: string;
  course_id: string;
  course_title: string;
}

const CertificatesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<CertificateWithCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    const fetchCertificates = async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("id, certificate_number, issued_at, course_id")
        .eq("user_id", user.id)
        .order("issued_at", { ascending: false });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      // Fetch course titles
      const courseIds = data.map((c) => c.course_id);
      const { data: courses } = await supabase
        .from("courses")
        .select("id, title")
        .in("id", courseIds);

      const courseMap = new Map(courses?.map((c) => [c.id, c.title]) ?? []);

      setCertificates(
        data.map((c) => ({
          ...c,
          course_title: courseMap.get(c.course_id) ?? "Unknown Course",
        }))
      );
      setLoading(false);
    };
    fetchCertificates();
  }, [user, navigate]);

  const handleDownload = (cert: CertificateWithCourse) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 850;

    const grad = ctx.createLinearGradient(0, 0, 1200, 850);
    grad.addColorStop(0, "#1a1040");
    grad.addColorStop(0.5, "#2d1b69");
    grad.addColorStop(1, "#1a3a4a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 850);

    ctx.strokeStyle = "#a78bfa";
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, 1140, 790);
    ctx.strokeStyle = "#5eead4";
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, 1120, 770);

    ctx.fillStyle = "#a78bfa";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("LEARNFLOW", 600, 100);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px sans-serif";
    ctx.fillText("Certificate of Completion", 600, 160);

    ctx.strokeStyle = "#5eead4";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(350, 185);
    ctx.lineTo(850, 185);
    ctx.stroke();

    ctx.fillStyle = "#c4b5fd";
    ctx.font = "18px sans-serif";
    ctx.fillText("This is to certify that", 600, 260);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px sans-serif";
    ctx.fillText(user?.email?.split("@")[0] || "Student", 600, 320);

    ctx.fillStyle = "#c4b5fd";
    ctx.font = "18px sans-serif";
    ctx.fillText("has successfully completed the course", 600, 390);

    ctx.fillStyle = "#5eead4";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText(cert.course_title, 600, 450);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px sans-serif";
    ctx.fillText(
      `Issued: ${new Date(cert.issued_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
      400,
      550
    );
    ctx.fillText(`Certificate No: ${cert.certificate_number}`, 800, 550);

    ctx.fillStyle = "#a78bfa";
    ctx.beginPath();
    ctx.arc(600, 500, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1040";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("★", 600, 508);

    ctx.strokeStyle = "#a78bfa33";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, 680);
    ctx.lineTo(1100, 680);
    ctx.stroke();

    ctx.fillStyle = "#64748b";
    ctx.font = "12px sans-serif";
    ctx.fillText("LearnFlow • Online Learning Platform", 600, 720);

    const link = document.createElement("a");
    link.download = `certificate-${cert.course_title.replace(/\s+/g, "-").toLowerCase()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("Certificate downloaded!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-4xl py-10">
        <div className="mb-8 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">My Certificates</h1>
            <p className="text-muted-foreground">Your earned course completion certificates</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : certificates.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <Award className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="font-display text-lg font-bold text-foreground mb-2">No certificates yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Complete all lessons in a course to earn your certificate.
            </p>
            <Link to="/">
              <Button className="gradient-primary text-primary-foreground">Browse Courses</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {certificates.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-full gradient-primary p-3">
                    <Award className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">{cert.course_title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Issued {new Date(cert.issued_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">{cert.certificate_number}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => handleDownload(cert)}>
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificatesPage;
