import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { artifacts } from "@/data/artifacts";
import type { Level, Purpose } from "@/data/artifacts";
import { FilterBar } from "@/components/FilterBar";
import { ArtifactCard } from "@/components/ArtifactCard";
import { SearchBar } from "@/components/SearchBar";
import type { ClassifyResult } from "@/lib/classifier";

const Index = () => {
  const [selectedLevels, setSelectedLevels] = useState<Level[]>([]);
  const [selectedPurposes, setSelectedPurposes] = useState<Purpose[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

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

    return artifacts.filter((a) => {
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
  }, [selectedLevels, selectedPurposes, selectedCategory, searchQuery]);

  const stats = useMemo(() => ({
    total: filtered.length,
    beginner: filtered.filter((a) => a.level === "초급").length,
    intermediate: filtered.filter((a) => a.level === "중급").length,
    advanced: filtered.filter((a) => a.level === "고급").length,
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
            <Stat label="초급" value={stats.beginner} color="text-level-beginner" />
            <Stat label="중급" value={stats.intermediate} color="text-level-intermediate" />
            <Stat label="고급" value={stats.advanced} color="text-level-advanced" />
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

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  );
}

export default Index;
