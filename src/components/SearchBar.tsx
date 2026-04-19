import { useEffect, useRef, useState } from "react";
import { Search, Loader2, Sparkles, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { classify, loadClassifier, type ClassifyResult } from "@/lib/classifier";

interface Props {
  onClassified: (query: string, result: ClassifyResult) => void;
  onCleared: () => void;
}

type Status = "idle" | "loading-model" | "ready" | "classifying" | "error";

export function SearchBar({ onClassified, onCleared }: Props) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<ClassifyResult | null>(null);
  const didLoad = useRef(false);

  useEffect(() => {
    if (didLoad.current) return;
    didLoad.current = true;
    setStatus("loading-model");
    loadClassifier()
      .then(() => setStatus("ready"))
      .catch((e) => {
        console.error("[SearchBar] model load failed:", e);
        setStatus("error");
        setError(formatError(e));
      });
  }, []);

  const submit = async () => {
    const q = query.trim();
    if (!q || status === "loading-model" || status === "classifying") return;
    setStatus("classifying");
    setError(null);
    try {
      const result = await classify(q);
      setLastResult(result);
      onClassified(q, result);
      setStatus("ready");
    } catch (e) {
      console.error("[SearchBar] classify failed:", e);
      setStatus("error");
      setError(formatError(e));
    }
  };

  const clear = () => {
    setQuery("");
    setLastResult(null);
    onCleared();
  };

  const disabled = status === "loading-model" || status === "classifying";

  return (
    <div className="space-y-3">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="예: 악성코드 침해 사고 중급자 분석, 레지스트리로 계정 추적, 네트워크 패킷 캡처"
            disabled={disabled}
            className="pl-9 pr-10 font-mono text-sm"
          />
          {query && (
            <button
              onClick={clear}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-secondary/60 text-muted-foreground"
              aria-label="지우기"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={submit}
          disabled={disabled || !query.trim()}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {status === "classifying" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          검색
        </button>
      </div>

      <StatusLine status={status} error={error} result={lastResult} />
    </div>
  );
}

function StatusLine({
  status,
  error,
  result,
}: {
  status: Status;
  error: string | null;
  result: ClassifyResult | null;
}) {
  if (status === "error") {
    return (
      <details className="text-xs font-mono text-destructive">
        <summary className="cursor-pointer">모델 로드 실패 (클릭해서 스택 펼치기)</summary>
        <pre className="mt-2 whitespace-pre-wrap break-all rounded bg-destructive/5 p-2 text-[11px] leading-snug">
          {error}
        </pre>
      </details>
    );
  }
  if (status === "loading-model") {
    return (
      <p className="text-xs font-mono text-muted-foreground flex items-center gap-2">
        <Loader2 className="h-3 w-3 animate-spin" />
        BERT 모델 다운로드 중…
      </p>
    );
  }
  if (status === "classifying") {
    return (
      <p className="text-xs font-mono text-muted-foreground flex items-center gap-2">
        <Loader2 className="h-3 w-3 animate-spin" />
        임베딩 계산 및 분류 중…
      </p>
    );
  }
  if (result) {
    return (
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
        <span className="text-muted-foreground">분류 결과:</span>
        <ScoreChip label="부문" value={result.category?.label} score={result.category?.score} />
        <ScoreChip label="목적" value={result.purpose?.label} score={result.purpose?.score} />
        <ScoreChip label="수준" value={result.level?.label} score={result.level?.score} />
      </div>
    );
  }
  return (
    <p className="text-xs font-mono text-muted-foreground">
      자연어로 검색하면 BERT가 부문·목적·수준을 자동 분류하고 의미 유사도로 정렬합니다.
    </p>
  );
}

function formatError(e: unknown): string {
  if (e instanceof Error) {
    const parts = [`${e.name}: ${e.message}`];
    if (e.stack) parts.push(e.stack);
    if ("cause" in e && e.cause) parts.push(`cause: ${String(e.cause)}`);
    return parts.join("\n\n");
  }
  try {
    return JSON.stringify(e, null, 2);
  } catch {
    return String(e);
  }
}

function ScoreChip({
  label,
  value,
  score,
}: {
  label: string;
  value?: string | null;
  score?: number;
}) {
  if (!value) {
    return (
      <span className="rounded border border-border bg-secondary/30 px-2 py-0.5 text-muted-foreground">
        {label}: —
      </span>
    );
  }
  return (
    <span className="rounded border border-primary/40 bg-primary/10 px-2 py-0.5 text-primary">
      {label}: {value}
      {typeof score === "number" ? ` (${score.toFixed(2)})` : ""}
    </span>
  );
}
