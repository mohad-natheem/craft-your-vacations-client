import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  href: string;
  label: string;
}

export default function AdminBackLink({ href, label }: Props) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-body-sm text-text-muted hover:text-primary mb-6 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </Link>
  );
}
