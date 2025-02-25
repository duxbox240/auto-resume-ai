import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Loader2, Menu, Plus, FileText, LogOut } from "lucide-react";

export default function DashboardNav() {
  const { user, logoutMutation } = useAuth();

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">AI Resume Builder</h2>
          <div className="space-y-1">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start text-base sm:text-sm">
                <FileText className="mr-2 h-4 w-4" />
                My Resumes
              </Button>
            </Link>
            <Link href="/create">
              <Button variant="ghost" className="w-full justify-start text-base sm:text-sm">
                <Plus className="mr-2 h-4 w-4" />
                Create New
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-auto p-4">
        <Button
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          variant="outline"
          className="w-full text-base sm:text-sm"
        >
          {logoutMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Navigation */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden fixed top-4 left-4 z-40">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <NavContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-card">
          <NavContent />
        </div>
      </div>
    </>
  );
}