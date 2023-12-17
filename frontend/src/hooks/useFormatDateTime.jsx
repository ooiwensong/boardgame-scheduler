import { format, formatDistanceToNow } from "date-fns";

export default function useFormatDateTime(data) {
  const date = data.date && format(new Date(data.date), "iii, dd MMM yyyy");
  const startTime = data.start_time && data.start_time.substring(0, 5);
  const endTime = data.end_time && data.end_time.substring(0, 5);
  const lastUpdated =
    data.last_updated && formatDistanceToNow(new Date(data.last_updated));
  const createdAt =
    data.created_at && format(new Date(data.created_at), "MMM yyyy");

  return { date, startTime, endTime, lastUpdated, createdAt };
}
