import type { BookingStatus } from "@/app/types/api";
import { bookingStatusClasses } from "@/lib/constants";

export { formatMonth } from "@/lib/constants";

interface Props {
  status: BookingStatus;
}

export default function BookingStatusBadge({ status }: Props) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-label-sm font-medium ${bookingStatusClasses[status]}`}>
      {status}
    </span>
  );
}
