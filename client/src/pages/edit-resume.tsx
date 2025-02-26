import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Resume, ResumeContent } from "@shared/schema";
import { Button } from "@/components/ui/button";
import DashboardNav from "@/components/dashboard-nav";
import ResumeForm from "@/components/resume-form";
import { ChevronLeft, Loader2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function EditResume() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const id = location.split("/")[2]; // Extract ID from /resume/:id/edit

  const { data: resume, isLoading } = useQuery<Resume>({
    queryKey: [`/api/resumes/${id}`],
  });

  const updateResumeMutation = useMutation({
    mutationFn: async (content: ResumeContent) => {
      const res = await apiRequest("PATCH", `/api/resumes/${id}`, {
        content,
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to update resume");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      queryClient.invalidateQueries({ queryKey: [`/api/resumes/${id}`] });
      toast({
        title: "Resume updated",
        description: "Your resume has been saved successfully",
      });
      setLocation(`/resume/${id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update resume",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!resume) {
    return <div>Resume not found</div>;
  }

  // Type assertion to ensure content matches ResumeContent type
  const content = resume.content as ResumeContent;

  return (
    <div className="min-h-screen">
      <DashboardNav />

      <main className="lg:pl-64">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Button variant="outline" asChild className="mb-4">
              <Link href={`/resume/${id}`}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Preview
              </Link>
            </Button>
            <h1 className="text-3xl font-bold mb-2">Edit Resume</h1>
            <p className="text-muted-foreground">
              Make changes to your resume and save to update
            </p>
          </div>

          <ResumeForm
            defaultValues={content}
            onSubmit={(content) => updateResumeMutation.mutate(content)}
            isSubmitting={updateResumeMutation.isPending}
          />
        </div>
      </main>
    </div>
  );
}