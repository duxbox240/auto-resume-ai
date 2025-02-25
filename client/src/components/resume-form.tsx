import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeContentSchema, ResumeContent } from "@shared/schema";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Trash2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ResumeForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: {
  defaultValues?: ResumeContent;
  onSubmit: (data: ResumeContent) => void;
  isSubmitting: boolean;
}) {
  const { toast } = useToast();
  const form = useForm<ResumeContent>({
    resolver: zodResolver(resumeContentSchema),
    defaultValues: defaultValues || {
      personalDetails: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        profilePicture: "",
        summary: "",
      },
      workExperience: [],
      education: [],
      skills: [],
      projects: [],
    },
  });

  const skillsSuggestionMutation = useMutation({
    mutationFn: async (workExperience: ResumeContent["workExperience"]) => {
      const res = await apiRequest("POST", "/api/suggestions/skills", {
        workExperience,
      });
      return res.json();
    },
    onSuccess: (data) => {
      form.setValue("skills", [...new Set([...form.getValues("skills"), ...data.skills])]);
      toast({
        title: "Skills suggested",
        description: "AI has suggested skills based on your work experience",
      });
    },
  });

  const summarySuggestionMutation = useMutation({
    mutationFn: async (data: { title: string; workExperience: ResumeContent["workExperience"] }) => {
      const res = await apiRequest("POST", "/api/suggestions/summary", data);
      return res.json();
    },
    onSuccess: (data) => {
      form.setValue("personalDetails.summary", data.summary);
      toast({
        title: "Summary generated",
        description: "AI has generated a professional summary based on your experience",
      });
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("personalDetails.profilePicture", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Personal Details</h3>
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src={form.watch("personalDetails.profilePicture")}
                    alt="Profile"
                  />
                  <AvatarFallback>
                    {form.watch("personalDetails.fullName")?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <FormLabel>Profile Picture (Optional)</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-2"
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="personalDetails.summary"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Professional Summary</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (form.watch("workExperience").length === 0) {
                            toast({
                              title: "Add work experience first",
                              description: "Please add some work experience to generate a summary",
                              variant: "destructive",
                            });
                            return;
                          }
                          summarySuggestionMutation.mutate({
                            title: form.watch("personalDetails.fullName"),
                            workExperience: form.watch("workExperience"),
                          });
                        }}
                        disabled={summarySuggestionMutation.isPending}
                      >
                        {summarySuggestionMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Wand2 className="h-4 w-4 mr-2" />
                            Generate with AI
                          </>
                        )}
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Write a compelling summary of your professional background and goals..."
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="personalDetails.fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personalDetails.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personalDetails.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personalDetails.location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personalDetails.linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Work Experience</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const current = form.getValues("workExperience");
                  form.setValue("workExperience", [
                    ...current,
                    {
                      title: "",
                      company: "",
                      location: "",
                      startDate: "",
                      endDate: "",
                      description: "",
                    },
                  ]);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </div>

            {form.watch("workExperience").map((_, index) => (
              <div key={index} className="mb-6 pb-6 border-b last:border-0">
                <div className="flex justify-between mb-4">
                  <h4 className="font-medium">Experience {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const current = form.getValues("workExperience");
                      form.setValue(
                        "workExperience",
                        current.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`workExperience.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`workExperience.${index}.company`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`workExperience.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input {...field} type="month" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`workExperience.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input {...field} type="month" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name={`workExperience.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}

            {form.watch("workExperience").length > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => skillsSuggestionMutation.mutate(form.getValues("workExperience"))}
                disabled={skillsSuggestionMutation.isPending}
              >
                {skillsSuggestionMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Suggest Skills with AI"
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Resume
        </Button>
      </form>
    </Form>
  );
}