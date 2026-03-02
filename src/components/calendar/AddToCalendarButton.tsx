import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AddToCalendarButton } from "add-to-calendar-button-react";

interface EventData {
  name: string;
  description?: string;
  startDate: string;
  startTime?: string;
  endTime?: string;
  location?: string;
}

const fmtTime = (t: string) => {
  const [h, m] = t.split(":");
  return h.padStart(2, "0") + ":" + (m ?? "00").padStart(2, "0");
};

export default function AtcbPortal() {
  const [event, setEvent] = useState<EventData | null>(null);
  const [mount, setMount] = useState<HTMLElement | null>(null);
  const observer = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const sync = () => {
      const el = document.getElementById("atcb-mount");
      if (el) {
        try {
          const data = JSON.parse(el.dataset.event || "");
          setEvent(data);
          setMount(el);
        } catch {
          setEvent(null);
          setMount(null);
        }
      } else {
        setEvent(null);
        setMount(null);
      }
    };

    sync();

    observer.current = new MutationObserver(sync);
    observer.current.observe(document.body, { childList: true, subtree: true });

    return () => observer.current?.disconnect();
  }, []);

  if (!event || !mount) return null;

  return createPortal(
    <AddToCalendarButton
      name={event.name}
      description={event.description}
      startDate={event.startDate}
      endDate={event.startDate}
      startTime={event.startTime ? fmtTime(event.startTime) : undefined}
      endTime={event.endTime ? fmtTime(event.endTime) : undefined}
      timeZone="America/Mexico_City"
      location={event.location}
      options={["Apple", "Google", "iCal", "Outlook.com", "Yahoo"]}
      label="Agregar a calendario"
      buttonStyle="round"
      size="3"
      lightMode="bodyScheme"
      language="es"
      trigger="click"
      forceOverlay
      hideBranding
      pastDateHandling="disable"
    />,
    mount,
  );
}
