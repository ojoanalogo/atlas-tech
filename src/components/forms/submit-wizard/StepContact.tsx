import type { StepProps } from "./types";

export default function StepContact({ state, setField }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-sans font-bold text-primary">
        Datos de contacto
      </h2>
      <p className="text-sm text-secondary">
        Tu información para que podamos comunicarnos contigo sobre este
        registro.
      </p>
      <div className="space-y-3">
        <label className="block">
          <span className="text-xs font-mono text-muted uppercase tracking-wider">
            Tu nombre *
          </span>
          <input
            type="text"
            value={state.submitterName}
            onChange={(e) => setField("submitterName", e.target.value)}
            required
            placeholder="Nombre completo"
            className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
          />
        </label>
        <label className="block">
          <span className="text-xs font-mono text-muted uppercase tracking-wider">
            Tu email *
          </span>
          <input
            type="email"
            value={state.submitterEmail}
            onChange={(e) => setField("submitterEmail", e.target.value)}
            required
            placeholder="tu@email.com"
            className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
          />
        </label>
        <label className="block">
          <span className="text-xs font-mono text-muted uppercase tracking-wider">
            Tu teléfono
          </span>
          <input
            type="tel"
            value={state.submitterPhone}
            onChange={(e) => setField("submitterPhone", e.target.value)}
            placeholder="+52 667 123 4567"
            className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
          />
        </label>
      </div>
    </div>
  );
}
