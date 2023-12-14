import { format, formatDistanceToNow } from "date-fns";

export default function useFormatDateTime(session) {
  const date = format(new Date(session.date), "iii, dd MMM yyyy");
  const startTime = session.start_time.substring(0, 5);
  const endTime = session.end_time.substring(0, 5);
  const lastUpdated = formatDistanceToNow(new Date(session.last_updated));

  return { date, startTime, endTime, lastUpdated };
}
