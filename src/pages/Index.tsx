import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Loader2, Download } from "lucide-react";
import { artifacts as staticArtifacts } from "@/data/artifacts";
import type { Artifact, Level, Purpose } from "@/data/artifacts";
import { FilterBar } from "@/components/FilterBar";
import { ArtifactCard } from "@/components/ArtifactCard";
import { SearchBar } from "@/components/SearchBar";
import type { ClassifyResult } from "@/lib/classifier";
import { fetchAndClassifyCves, type CveFetchProgress } from "@/lib/nvd";

const Index = () => {
  const [selectedLevels, setSelectedLevels] = useState<Level[]>([]);
  const [selectedPurposes, setSelectedPurposes] = useState<Purpose[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cveArtifacts, setCveArtifacts] = useState<Artifact[]>([]);
  const [cveStatus, setCveStatus] = useState<"idle" | "loading" | "error">("idle");
  const [cveProgress, setCveProgress] = useState<CveFetchProgress | null>(null);
  const [cveError, setCveError] = useState<string | null>(null);

  const allArtifacts = useMemo(
    () => [...staticArtifacts, ...cveArtifacts],
    [cveArtifacts],
  );

  const loadCves = async () => {
    setCveStatus("loading");
    setCveError(null);
    try {
      const results = await fetchAndClassifyCves(10, (p) => setCveProgress(p));
      setCveArtifacts(results);
      setCveStatus("idle");
    } catch (e) {
      console.error("[Index] CVE load failed:", e);
      setCveError(e instanceof Error ? e.message : String(e));
      setCveStatus("error");
    }
  };

  const toggleLevel = (l: Level) =>
    setSelectedLevels((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]
    );

  const togglePurpose = (p: Purpose) =>
    setSelectedPurposes((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );

  const handleClassified = (query: string, result: ClassifyResult) => {
    setSearchQuery(query);
    if (result.level) setSelectedLevels([result.level.label]);
    else setSelectedLevels([]);
    if (result.purpose) setSelectedPurposes([result.purpose.label]);
    else setSelectedPurposes([]);
    setSelectedCategory(result.category?.label ?? null);
  };

  const handleCleared = () => {
    setSearchQuery("");
    setSelectedLevels([]);
    setSelectedPurposes([]);
    setSelectedCategory(null);
  };

  const filtered = useMemo(() => {
    const tokens = searchQuery
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length >= 2);
    const noClassifier =
      selectedLevels.length === 0 && selectedPurposes.length === 0 && !selectedCategory;

    return allArtifacts.filter((a) => {
      if (selectedLevels.length && !selectedLevels.includes(a.level as Level)) return false;
      if (selectedPurposes.length && !selectedPurposes.includes(a.purpose as Purpose)) return false;
      if (selectedCategory && a.category !== selectedCategory) return false;

      // When classification produced no filters but user searched something,
      // fall back to substring match over artifact text fields.
      if (noClassifier && tokens.length) {
        const haystack = [
          a.category,
          a.purpose,
          a.level,
          a.summary ?? "",
          a.tools ?? "",
          a.dataNeeded ?? "",
          ...a.artifacts.flatMap((x) => [x.name, x.behavior, x.path]),
        ]
          .join(" ")
          .toLowerCase();
        if (!tokens.some((t) => haystack.includes(t))) return false;
      }
      return true;
    });
  }, [selectedLevels, selectedPurposes, selectedCategory, searchQuery, allArtifacts]);

  const stats = useMemo(() => ({
    total: filtered.length,
    beginner: filtered.filter((a) => a.level === "입문자").length,
    intermediate: filtered.filter((a) => a.level === "중급자").length,
    advanced: filtered.filter((a) => a.level === "전문가").length,
  }), [filtered]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)]" />
        <div className="container relative mx-auto px-4 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-primary font-mono tracking-wider uppercase">OS Artifact Analysis</span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
              수준별 OS 아티팩트
              <br />
              <span className="text-primary">분석 가이드</span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed">
              디지털 포렌식, 보안 침해 대응, 교육 학습 — 목적과 수준에 맞는 Windows OS 아티팩트 분석 방법론을 탐색하세요.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-6 mt-8 font-mono text-xs"
          >
            <Stat label="전체" value={stats.total} color="text-foreground" />
            <Stat label="입문자" value={stats.beginner} color="text-level-beginner" />
            <Stat label="중급자" value={stats.intermediate} color="text-level-intermediate" />
            <Stat label="전문가" value={stats.advanced} color="text-level-advanced" />
          </motion.div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-4 rounded-lg border border-border bg-card/50 p-4"
        >
          <SearchBar onClassified={handleClassified} onCleared={handleCleared} />
        </motion.div>

        {/* NIST CVE ingestion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
          className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card/50 p-4"
        >
          <button
            onClick={loadCves}
            disabled={cveStatus === "loading"}
            className="inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {cveStatus === "loading" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            NIST CVE 10건 불러오기
          </button>
          <CveStatusLine
            status={cveStatus}
            progress={cveProgress}
            error={cveError}
            loadedCount={cveArtifacts.length}
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 rounded-lg border border-border bg-card/50 p-4"
        >
          <FilterBar
            selectedLevels={selectedLevels}
            selectedPurposes={selectedPurposes}
            selectedCategory={selectedCategory}
            onToggleLevel={toggleLevel}
            onTogglePurpose={togglePurpose}
            onSetCategory={setSelectedCategory}
          />
        </motion.div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm">
            선택한 필터에 해당하는 아티팩트가 없습니다.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a, i) => (
              <ArtifactCard key={a.id} artifact={a} index={i} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground font-mono">
        OS Artifact Analysis Guide — Digital Forensics Reference
      </footer>
    </div>
  );
};

function CveStatusLine({
  status,
  progress,
  error,
  loadedCount,
}: {
  status: "idle" | "loading" | "error";
  progress: CveFetchProgress | null;
  error: string | null;
  loadedCount: number;
}) {
  if (status === "error") {
    return (
      <span className="text-xs font-mono text-destructive truncate max-w-full">
        불러오기 실패: {error}
      </span>
    );
  }
  if (status === "loading" && progress) {
    if (progress.stage === "fetching") {
      return <span className="text-xs font-mono text-muted-foreground">NVD API 호출 중…</span>;
    }
    if (progress.stage === "classifying") {
      return (
        <span className="text-xs font-mono text-muted-foreground">
          BERT 분류 중 {progress.current + 1}/{progress.total}
        </span>
      );
    }
  }
  if (loadedCount > 0) {
    return (
      <span className="text-xs font-mono text-muted-foreground">
        최근 CVE {loadedCount}건을 아티팩트로 통합 완료
      </span>
    );
  }
  return (
    <span className="text-xs font-mono text-muted-foreground">
      NVD API에서 최근 30일 CVE를 받아 BERT로 purpose · level 분류 후 아티팩트로 편입합니다.
    </span>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  );
}

export default Index;
