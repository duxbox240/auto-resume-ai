import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Resume, ResumeContent } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DashboardNav from "@/components/dashboard-nav";
import { ResumePDF } from "@/components/resume-pdf";
import { ResumePreview } from "@/components/resume-preview";
import { Download, ChevronLeft, Pencil, Loader2 } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";

export default function ViewResume() {
  const [location] = useLocation();
  const id = location.split("/")[2]; // Extract ID from /resume/:id

  const { data: resume, isLoading, error } = useQuery<Resume>({
    queryKey: [`/api/resumes/${id}`],
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Resume not found</h2>
          <p className="text-muted-foreground mb-4">
            The resume you're looking for doesn't exist or has been deleted.
          </p>
          <Button asChild>
            <Link href="/">Back to My Resumes</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const content = resume.content as ResumeContent;

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="lg:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <Button variant="outline" asChild className="mb-2">
                <Link href="/">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to My Resumes
                </Link>
              </Button>
              <h1 className="text-3xl font-bold">{resume.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Last updated: {new Date(resume.updatedAt!).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Style: {resume.template}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/resume/${id}/edit`}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Resume
                </Link>
              </Button>
              <PDFDownloadLink
                document={<ResumePDF content={content} />}
                fileName={`${resume.title.toLowerCase().replace(/\s+/g, '-')}.pdf`}
              >
                {({ loading }) => (
                  <Button variant="outline">
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </>
                    )}
                  </Button>
                )}
              </PDFDownloadLink>
            </div>
          </div>

          <Card className="mb-8">
            <div className="overflow-y-auto">
              <ResumePreview content={content} />
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}