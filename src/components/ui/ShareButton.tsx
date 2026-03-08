import { useState } from "react";
import { Share2, Check } from "lucide-react";

export default function ShareButton({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    // Mobile: use native share sheet when available
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled — ignore
      }
      return;
    }

    // Desktop fallback: copy to clipboard
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-card text-secondary font-mono font-semibold text-sm rounded-lg hover:bg-elevated hover:text-primary transition-colors cursor-pointer"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-accent" />
          <span className="text-accent">LINK COPIADO</span>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          COMPARTIR
        </>
      )}
    </button>
  );
}
