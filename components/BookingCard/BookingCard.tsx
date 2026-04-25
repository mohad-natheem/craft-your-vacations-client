import { CalendarDays, Users, FileText, Clock } from "lucide-react";
import type { Booking, BookingStatus } from "@/app/types/api";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatPreferredMonth(value: string): string {
  const [year, month] = value.split("-");
  return `${MONTH_NAMES[parseInt(month, 10) - 1]} ${year}`;
}

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  pending: { label: "Pending Review", className: "bg-primary/15 text-primary" },
  confirmed: { label: "Confirmed", className: "bg-green-500/15 text-green-400" },
  cancelled: { label: "Cancelled", className: "bg-red-500/15 text-red-400" },
};

interface BookingCardProps {
  booking: Booking;
}

export default function BookingCard({ booking }: BookingCardProps) {
  const status = statusConfig[booking.status];

  return (
    <div className="glass rounded-2xl p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-headline-sm text-text">{booking.packageTitle}</h2>
        <span
          className={`shrink-0 px-3 py-1 rounded-full text-label-sm font-medium ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary/70 shrink-0" />
          <div>
            <p className="text-label-sm text-text-muted uppercase tracking-widest">
              Travelers
            </p>
            <p className="text-body-sm text-text">{booking.travelersCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-primary/70 shrink-0" />
          <div>
            <p className="text-label-sm text-text-muted uppercase tracking-widest">
              Travel Month
            </p>
            <p className="text-body-sm text-text">
              {formatPreferredMonth(booking.preferredMonth)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary/70 shrink-0" />
          <div>
            <p className="text-label-sm text-text-muted uppercase tracking-widest">
              Submitted
            </p>
            <p className="text-body-sm text-text">
              {new Date(booking.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Notes */}
      {booking.notes && (
        <div className="flex items-start gap-2 pt-2 border-t border-outline">
          <FileText className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
          <p className="text-body-sm text-text-muted leading-relaxed">
            {booking.notes}
          </p>
        </div>
      )}
    </div>
  );
}
