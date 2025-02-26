import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResumeContent } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const oneClickSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  yearsOfExperience: z.string().min(1, "Years of experience is required"),
  industry: z.string().min(1, "Industry is required"),
  skills: z.string().min(1, "Skills are required"),
});

type OneClickFormData = z.infer<typeof oneClickSchema>;

export default function OneClickBuilder({
  onComplete
}: {
  onComplete: (content: ResumeContent) => void;
}) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const form = useForm<OneClickFormData>({
    resolver: zodResolver(oneClickSchema),
    defaultValues: {
      jobTitle: "",
      yearsOfExperience: "",
      industry: "",
      skills: "",
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (data: OneClickFormData) => {
      setIsGenerating(true);
      const res = await apiRequest("POST", "/api/generate-resume", {
        ...data,
        skills: data.skills.split(",").map(s => s.trim()),
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to generate resume");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Resume generated",
        description: "Your resume has been generated successfully",
      });
      onComplete(data);
    },
    onError: (error: Error) => {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsGenerating(false);
    }
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => generateMutation.mutate(data))}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Desired Job Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. Senior Software Engineer" className="text-base sm:text-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="yearsOfExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. 5" className="text-base sm:text-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. Technology" className="text-base sm:text-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key Skills (comma-separated)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g. JavaScript, React, Node.js" 
                    className="text-base sm:text-sm" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full text-base sm:text-sm"
            disabled={generateMutation.isPending}
          >
            {generateMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate Resume
          </Button>
        </form>
      </Form>

      <Dialog open={isGenerating} onOpenChange={setIsGenerating}>
        <DialogContent aria-describedby="generating-description">
          <DialogHeader>
            <DialogTitle>Generating Your Resume</DialogTitle>
            <DialogDescription id="generating-description">
              Please wait while AI generates your professional resume based on the provided information. This may take a few moments...
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-8" role="status" aria-label="Generating resume">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}