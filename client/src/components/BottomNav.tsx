import { Timer, PlusCircle, BarChart3, History } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
      <div className="flex justify-around">
        <Link href="/">
          <a className={`flex flex-col items-center py-2 px-3 ${location === "/" ? "text-primary" : "text-gray-600"}`}>
            <Timer size={20} />
            <span className="text-xs">Timer</span>
          </a>
        </Link>
        
        <Link href="/log">
          <a className={`flex flex-col items-center py-2 px-3 ${location === "/log" ? "text-primary" : "text-gray-600"}`}>
            <PlusCircle size={20} />
            <span className="text-xs">Log</span>
          </a>
        </Link>
        
        <Link href="/progress">
          <a className={`flex flex-col items-center py-2 px-3 ${location === "/progress" ? "text-primary" : "text-gray-600"}`}>
            <BarChart3 size={20} />
            <span className="text-xs">Progress</span>
          </a>
        </Link>
        
        <Link href="/history">
          <a className={`flex flex-col items-center py-2 px-3 ${location === "/history" ? "text-primary" : "text-gray-600"}`}>
            <History size={20} />
            <span className="text-xs">History</span>
          </a>
        </Link>
      </div>
    </nav>
  );
}
