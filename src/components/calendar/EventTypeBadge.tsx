export default function EventTypeBadge({ isInPerson }: { isInPerson: boolean }) {
  return (
    <span
      className={`text-2xs font-mono font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded whitespace-nowrap ${
        isInPerson
          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
          : "bg-blue-500/15 text-blue-600 dark:text-blue-400"
      }`}
    >
      {isInPerson ? "Presencial" : "Virtual"}
    </span>
  );
}
