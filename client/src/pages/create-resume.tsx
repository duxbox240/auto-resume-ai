import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { ResumeContent } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DashboardNav from "@/components/dashboard-nav";
import ResumeTemplates from "@/components/resume-templates";
import ResumeForm from "@/components/resume-form";
import { useToast } from "@/hooks/use-toast";

export default function CreateResume() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [template, setTemplate] = useState("professional");

  const createResumeMutation = useMutation({
    mutationFn: async (data: { title: string; template: string; content: ResumeContent }) => {
      const res = await apiRequest("POST", "/api/resumes", data);
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to create resume");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      toast({
        title: "Resume created",
        description: "Your resume has been saved successfully",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save resume",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen">
      <DashboardNav />

      <main className="lg:pl-64">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create New Resume</h1>
            <p className="text-muted-foreground">
              Fill in your details and choose a template to create your resume
            </p>
          </div>

          {step === 1 && (
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Resume Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Resume Title
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Software Developer Resume"
                  />
                </div>

                <ResumeTemplates
                  value={template}
                  onChange={setTemplate}
                />

                <Button
                  onClick={() => setStep(2)}
                  disabled={!title || !template}
                  className="w-full"
                >
                  Continue
                </Button>
              </div>
            </Card>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="mb-4"
              >
                Back to Templates
              </Button>

              <ResumeForm
                onSubmit={(content) => {
                  createResumeMutation.mutate({
                    title,
                    template,
                    content,
                  });
                }}
                isSubmitting={createResumeMutation.isPending}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}