import type { RefObject } from "react";
import { X } from "lucide-react";
import { ENTRY_TYPES, type StepProps, type CityOption } from "./types";

interface Props extends StepProps {
  cities: CityOption[];
  logoRef: RefObject<HTMLInputElement | null>;
  coverRef: RefObject<HTMLInputElement | null>;
}

function handleFilePreview(
  file: File | undefined,
  setField: (field: string, value: unknown) => void,
  field: string,
) {
  if (file) {
    const url = URL.createObjectURL(file);
    setField(field, url);
  } else {
    setField(field, null);
  }
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-muted shrink-0">{label}</span>
      <span className="text-xs font-mono text-primary text-right">{value}</span>
    </div>
  );
}

export default function StepReview({ state, setField, cities, logoRef, coverRef }: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-sans font-bold text-primary">
        Imágenes y envío
      </h2>

      <div className="space-y-4">
        <div>
          <span className="text-xs font-mono text-muted uppercase tracking-wider block mb-1">
            Logo
          </span>
          <input
            ref={logoRef}
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleFilePreview(e.target.files?.[0], setField, "logoPreview")
            }
            className="w-full text-sm text-muted font-mono file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-border file:text-sm file:font-mono file:font-semibold file:bg-card file:text-primary hover:file:border-accent file:transition-colors file:cursor-pointer"
          />
          {state.logoPreview && (
            <div className="mt-2 relative w-20 h-20">
              <img
                src={state.logoPreview}
                alt="Logo preview"
                className="w-20 h-20 rounded-lg border border-border object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setField("logoPreview", null);
                  if (logoRef.current) logoRef.current.value = "";
                }}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
        <div>
          <span className="text-xs font-mono text-muted uppercase tracking-wider block mb-1">
            Imagen de portada
          </span>
          <input
            ref={coverRef}
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleFilePreview(e.target.files?.[0], setField, "coverPreview")
            }
            className="w-full text-sm text-muted font-mono file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-border file:text-sm file:font-mono file:font-semibold file:bg-card file:text-primary hover:file:border-accent file:transition-colors file:cursor-pointer"
          />
          {state.coverPreview && (
            <div className="mt-2 relative">
              <img
                src={state.coverPreview}
                alt="Cover preview"
                className="w-full max-h-48 rounded-lg border border-border object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setField("coverPreview", null);
                  if (coverRef.current) coverRef.current.value = "";
                }}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Review summary */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-2">
        <h3 className="font-mono text-xs text-muted uppercase tracking-wider mb-3">
          Resumen
        </h3>
        <SummaryRow
          label="Tipo"
          value={ENTRY_TYPES.find((t) => t.type === state.entryType)?.label}
        />
        <SummaryRow label="Nombre" value={state.name} />
        {state.tagline && <SummaryRow label="Tagline" value={state.tagline} />}
        <SummaryRow
          label="Municipio"
          value={cities.find((m) => m.id === state.city)?.name}
        />
        {state.website && <SummaryRow label="Web" value={state.website} />}
        {state.tags.length > 0 && (
          <SummaryRow label="Etiquetas" value={state.tags.join(", ")} />
        )}
        <SummaryRow label="Contacto" value={state.submitterName} />
        <SummaryRow label="Email" value={state.submitterEmail} />
      </div>
    </div>
  );
}
