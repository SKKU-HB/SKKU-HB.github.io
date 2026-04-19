import { levels, purposes, categories } from "@/data/artifacts";
import type { Level, Purpose } from "@/data/artifacts";

interface Props {
  selectedLevels: Level[];
  selectedPurposes: Purpose[];
  selectedCategory: string | null;
  onToggleLevel: (l: Level) => void;
  onTogglePurpose: (p: Purpose) => void;
  onSetCategory: (c: string | null) => void;
}

const levelStyles: Record<string, string> = {
  "초급": "border-level-beginner/40 bg-level-beginner/10 text-level-beginner",
  "중급": "border-level-intermediate/40 bg-level-intermediate/10 text-level-intermediate",
  "고급": "border-level-advanced/40 bg-level-advanced/10 text-level-advanced",
};

const purposeStyles: Record<string, string> = {
  "수사 조사": "border-purpose-forensic/40 bg-purpose-forensic/10 text-purpose-forensic",
  "보안 침해 분석": "border-purpose-security/40 bg-purpose-security/10 text-purpose-security",
  "기본 보안": "border-purpose-education/40 bg-purpose-education/10 text-purpose-education",
};

const purposeIcons: Record<string, string> = {
  "수사 조사": "🔍",
  "보안 침해 분석": "🚨",
  "기본 보안": "🎓",
};

const categoryIcons: Record<string, string> = {
  "파일시스템": "💾",
  "사용자 행위": "👤",
  "레지스트리 분석": "🗂",
  "계정 및 인증 분석": "🔑",
  "시스템 정보 분석": "🖥",
  "이벤트 로그 분석": "📋",
  "네트워크 분석": "🌐",
  "NIST CVE": "🛡️",
};

export function FilterBar(props: Props) {
  return (
    <div className="space-y-4">
      {/* Category */}
      <FilterGroup label="부문">
        <Chip
          active={props.selectedCategory === null}
          onClick={() => props.onSetCategory(null)}
          className="border-primary/40 bg-primary/10 text-primary"
        >
          전체
        </Chip>
        {categories.map((c) => (
          <Chip
            key={c}
            active={props.selectedCategory === c}
            onClick={() => props.onSetCategory(props.selectedCategory === c ? null : c)}
            className="border-primary/40 bg-primary/10 text-primary"
          >
            {categoryIcons[c]} {c}
          </Chip>
        ))}
      </FilterGroup>

      {/* Level */}
      <FilterGroup label="수준">
        {levels.map((l) => (
          <Chip
            key={l}
            active={props.selectedLevels.includes(l)}
            onClick={() => props.onToggleLevel(l)}
            className={levelStyles[l]}
          >
            {l === "초급" ? "🟢" : l === "중급" ? "🟡" : "🔴"} {l}
          </Chip>
        ))}
      </FilterGroup>

      {/* Purpose */}
      <FilterGroup label="목적">
        {purposes.map((p) => (
          <Chip
            key={p}
            active={props.selectedPurposes.includes(p)}
            onClick={() => props.onTogglePurpose(p)}
            className={purposeStyles[p]}
          >
            {purposeIcons[p]} {p}
          </Chip>
        ))}
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground w-10 shrink-0">{label}</span>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 ${
        active ? className : "border-border bg-secondary/30 text-muted-foreground hover:border-muted-foreground/40"
      }`}
    >
      {children}
    </button>
  );
}
