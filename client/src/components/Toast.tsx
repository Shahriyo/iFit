import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

interface ToastProps {
  message: string;
  visible: boolean;
}

export default function Toast({ message, visible }: ToastProps) {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
    
    if (visible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <div 
      className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-dark text-white px-4 py-2 rounded-md shadow-lg flex items-center transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <Bell className="mr-2 h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}
