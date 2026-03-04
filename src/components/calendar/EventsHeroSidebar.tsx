import { useEventsData } from "../../hooks/useEventsData";
import { UpcomingEventsSidebar } from "./EventCalendar";

export default function EventsHeroSidebar() {
  const { events, status, refetch } = useEventsData();
  return <UpcomingEventsSidebar events={events} status={status} refetch={refetch} />;
}
