import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export default function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "glass ghost-border shadow-lg shadow-primary/20 rounded-3xl p-10 w-full max-w-sm flex flex-col items-center gap-8",
        className
      )}
    >
      {children}
    </div>
  );
}
