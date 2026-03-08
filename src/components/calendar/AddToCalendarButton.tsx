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
      size="2"
      lightMode="bodyScheme"
      styleLight={[
        "--btn-background: transparent",
        "--btn-hover-background: #f3f2ef",
        "--btn-border: #d4d4d8",
        "--btn-hover-border: transparent",
        "--btn-text: #18181b",
        "--btn-hover-text: #18181b",
        "--btn-border-radius: 0.5rem",
        "--btn-padding-x: 0.75rem",
        "--btn-padding-y: 0.5rem",
        "--wrapper-padding: 0px",
        "--btn-shadow: none",
        "--btn-hover-shadow: none",
        "--btn-active-shadow: none",
        "--btn-font-weight: 400",
        "--font: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
        "--list-background: #ffffff",
        "--list-hover-background: #f3f2ef",
        "--list-text: #18181b",
        "--list-hover-text: #1a7a4f",
        "--list-close-background: #f3f2ef",
        "--list-close-text: #71717a",
        "--list-border-radius: 0.5rem",
        "--list-shadow: 0 4px 12px rgb(0 0 0 / 8%)",
        "--overlay-background: rgb(0 0 0 / 50%)",
      ].join("; ")}
      styleDark={[
        "--btn-background: transparent",
        "--btn-hover-background: #141414",
        "--btn-border: #2f2f2f",
        "--btn-hover-border: transparent",
        "--btn-text: #ffffff",
        "--btn-hover-text: #ffffff",
        "--btn-border-radius: 0.5rem",
        "--btn-padding-x: 0.75rem",
        "--btn-padding-y: 0.5rem",
        "--wrapper-padding: 0px",
        "--btn-shadow: none",
        "--btn-hover-shadow: none",
        "--btn-active-shadow: none",
        "--btn-font-weight: 400",
        "--font: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
        "--list-background: #0a0a0a",
        "--list-hover-background: #141414",
        "--list-text: #ffffff",
        "--list-hover-text: #42ab7a",
        "--list-close-background: #141414",
        "--list-close-text: #6b6b6b",
        "--list-border-radius: 0.5rem",
        "--list-shadow: 0 4px 12px rgb(0 0 0 / 24%)",
        "--overlay-background: rgb(0 0 0 / 60%)",
      ].join("; ")}
      language="es"
      trigger="click"
      forceOverlay
      hideBranding
      pastDateHandling="disable"
    />,
    mount,
  );
}
