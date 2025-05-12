import { ReactNode } from "react";
import BottomNav from "./BottomNav";
import { useLocation } from "wouter";
import { Settings } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  const getTitle = () => {
    switch (location) {
      case "/":
        return "Timer";
      case "/log":
        return "Log Workout";
      case "/progress":
        return "Progress";
      case "/history":
        return "History";
      default:
        return "iFit";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">iFit</h1>
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2">
                <Settings size={24} />
              </button>
            </SheetTrigger>
            <SheetContent>
              <div className="py-4">
                <h2 className="text-lg font-semibold mb-4">App Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Version</span>
                    <span className="text-muted-foreground">1.0.0</span>
                  </div>
                  {/* Additional settings could go here */}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-16">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
