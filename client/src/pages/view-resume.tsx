import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Resume, ResumeContent } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DashboardNav from "@/components/dashboard-nav";
import { ResumePDF } from "@/components/resume-pdf";
import { Download, ChevronLeft, Pencil, Loader2 } from "lucide-react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { Link } from "wouter";

export default function ViewResume() {
  const [location] = useLocation();
  const id = location.split("/").pop();

  const { data: resume, isLoading } = useQuery<Resume>({
    queryKey: [`/api/resumes/${id}`],
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
                <Link href={`/resume/${resume.id}/edit`}>
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

          <Card className="mb-8 p-4">
            <div className="w-full h-[calc(100vh-16rem)] border rounded-lg overflow-hidden">
              <PDFViewer style={{ width: '100%', height: '100%' }}>
                <ResumePDF content={content} />
              </PDFViewer>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}