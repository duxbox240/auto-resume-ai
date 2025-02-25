import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Resume } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardNav from "@/components/dashboard-nav";
import { Plus, Loader2 } from "lucide-react";

export default function HomePage() {
  const { data: resumes, isLoading } = useQuery<Resume[]>({
    queryKey: ["/api/resumes"],
  });

  return (
    <div className="min-h-screen">
      <DashboardNav />
      
      <main className="lg:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Resumes</h1>
            <Link href="/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Resume
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !resumes?.length ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8">
                <h2 className="text-xl font-semibold mb-2">No resumes yet</h2>
                <p className="text-muted-foreground mb-4">
                  Create your first resume to get started
                </p>
                <Link href="/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Resume
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumes.map((resume) => (
                <Card key={resume.id}>
                  <CardHeader>
                    <CardTitle>{resume.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="outline" className="flex-1">
                        Edit
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
