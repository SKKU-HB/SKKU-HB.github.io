import { motion } from "framer-motion";
import type { Artifact } from "@/data/artifacts";

const levelColorMap: Record<string, string> = {
  "입문자": "bg-level-beginner/15 text-level-beginner border-level-beginner/30",
  "중급자": "bg-level-intermediate/15 text-level-intermediate border-level-intermediate/30",
  "전문가": "bg-level-advanced/15 text-level-advanced border-level-advanced/30",
};

const levelDotMap: Record<string, string> = {
  "입문자": "bg-level-beginner",
  "중급자": "bg-level-intermediate",
  "전문가": "bg-level-advanced",
};

const purposeColorMap: Record<string, string> = {
  "법정 증거 수집": "text-purpose-forensic",
  "침해사고 대응": "text-purpose-security",
  "일반 점검 및 교육": "text-purpose-education",
};

interface Props {
  artifact: Artifact;
  index: number;
}

export function ArtifactCard({ artifact, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group relative rounded-lg border border-border bg-card p-5 hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.2)]"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <span className="text-sm font-medium text-muted-foreground truncate">{artifact.category}</span>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs ${purposeColorMap[artifact.purpose] ?? "text-muted-foreground"}`}>
            {artifact.purpose}
          </span>
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${levelColorMap[artifact.level]}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${levelDotMap[artifact.level]}`} />
            {artifact.level}
          </span>
        </div>
      </div>

      {/* Artifact items */}
      {artifact.artifacts.length > 0 && (
        <div className="mb-4 space-y-1.5">
          {artifact.artifacts.map((item, i) => (
            <div key={i} className="rounded-md bg-secondary/50 px-3 py-2 text-xs">
              <span className="font-medium text-primary">{item.name}</span>
              <span className="text-muted-foreground mx-1.5">—</span>
              <span className="text-card-foreground/70">{item.behavior}</span>
              <div className="font-mono text-primary/70 break-all mt-0.5 leading-relaxed">{item.path}</div>
            </div>
          ))}
        </div>
      )}

      {/* Content sections */}
      <div className="space-y-3 text-sm">
        {artifact.tools && (
          <Section label="🛠 주요 툴" content={artifact.tools} />
        )}
        {artifact.dataNeeded && (
          <Section label="📄 필요 데이터" content={artifact.dataNeeded} />
        )}
        {artifact.summary && (
          <Section label="📝 요약" content={artifact.summary} accent />
        )}
      </div>
    </motion.div>
  );
}

function Section({ label, content, accent, warning, highlight }: {
  label: string;
  content: string;
  accent?: boolean;
  warning?: boolean;
  highlight?: boolean;
}) {
  let textClass = "text-card-foreground/80";
  if (accent) textClass = "text-accent";
  if (warning) textClass = "text-level-intermediate/90";
  if (highlight) textClass = "text-primary/90";

  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      <p className={`text-xs leading-relaxed ${textClass}`}>{content}</p>
    </div>
  );
}
