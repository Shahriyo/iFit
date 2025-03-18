import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
}

export default function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <Card className="bg-white rounded-lg shadow p-4">
      <CardContent className="p-0 flex flex-col items-center">
        <Icon className="text-primary text-3xl" />
        <span className="text-sm text-gray-500 mt-1">{label}</span>
        <span className="text-xl font-bold mt-1">{value}</span>
      </CardContent>
    </Card>
  );
}
