import { pipeline, env, type FeatureExtractionPipeline } from "@huggingface/transformers";
import { levels, purposes, categories } from "@/data/artifacts";
import type { Level, Purpose } from "@/data/artifacts";

env.allowLocalModels = false;
env.allowRemoteModels = true;
// Prevent transformers.js from reading stale/partial entries out of the
// browser Cache API; the Vite dev server has been observed to return opaque
// or truncated cached responses which then break internal download paths.
env.useBrowserCache = false;
env.useFSCache = false;
env.useCustomCache = false;

const MODEL_ID = "Xenova/multilingual-e5-small";

const levelHypotheses: Record<Level, string> = {
  "초급": "초급 수준의 기본적인 포렌식 분석 입문자용 내용",
  "중급": "중급 수준의 심화 포렌식 분석 실무자용 내용",
  "고급": "고급 수준의 전문적인 포렌식 분석 전문가용 내용",
};

const purposeHypotheses: Record<Purpose, string> = {
  "수사 조사": "범죄 수사, 법적 증거 확보, 디지털 포렌식 조사",
  "보안 침해 분석": "해킹, 악성코드, 침해 사고 대응 및 분석",
  "기본 보안": "보안 입문 학습, 교육, 기본 보안 개념",
};

const categoryHypotheses: Record<string, string> = {
  "사용자 행위": "사용자의 프로그램 실행, 파일 접근, 행동 흔적 분석",
  "레지스트리 분석": "Windows 레지스트리 하이브와 키 값 분석",
  "계정 및 인증 분석": "사용자 계정, 비밀번호, 로그인 인증 분석",
  "시스템 정보 분석": "운영체제 버전, 하드웨어, 시스템 구성 정보 분석",
  "이벤트 로그 분석": "Windows 이벤트 로그와 시스템 로그 분석",
  "네트워크 분석": "네트워크 트래픽, 연결, 통신 기록 분석",
};

type LabelEmbeddings = {
  levels: Map<Level, Float32Array>;
  purposes: Map<Purpose, Float32Array>;
  categories: Map<string, Float32Array>;
};

let extractorPromise: Promise<FeatureExtractionPipeline> | null = null;
let labelEmbeddingsPromise: Promise<LabelEmbeddings> | null = null;

export function loadClassifier(): Promise<FeatureExtractionPipeline> {
  if (!extractorPromise) {
    extractorPromise = (pipeline("feature-extraction", MODEL_ID, {
      dtype: "q8",
      device: "wasm",
    }) as Promise<FeatureExtractionPipeline>).catch((e) => {
      extractorPromise = null;
      console.error("[classifier] pipeline load failed:", e);
      throw e;
    });
  }
  return extractorPromise;
}

async function embed(texts: string[]): Promise<Float32Array[]> {
  const extractor = await loadClassifier();
  const output = await extractor(texts, { pooling: "mean", normalize: true });
  const data = output.data as Float32Array;
  const dim = output.dims[output.dims.length - 1];
  return Array.from({ length: texts.length }, (_, i) =>
    data.slice(i * dim, (i + 1) * dim)
  );
}

function cosine(a: Float32Array, b: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

// multilingual-e5-small expects "query: " / "passage: " prefixes.
const asQuery = (s: string) => `query: ${s}`;
const asPassage = (s: string) => `passage: ${s}`;

async function getLabelEmbeddings(): Promise<LabelEmbeddings> {
  if (!labelEmbeddingsPromise) {
    labelEmbeddingsPromise = (async () => {
      const allTexts = [
        ...levels.map((l) => asPassage(levelHypotheses[l])),
        ...purposes.map((p) => asPassage(purposeHypotheses[p])),
        ...categories.map((c) => asPassage(categoryHypotheses[c])),
      ];
      const vecs = await embed(allTexts);
      const levelsMap = new Map<Level, Float32Array>();
      const purposesMap = new Map<Purpose, Float32Array>();
      const categoriesMap = new Map<string, Float32Array>();
      let i = 0;
      for (const l of levels) levelsMap.set(l, vecs[i++]);
      for (const p of purposes) purposesMap.set(p, vecs[i++]);
      for (const c of categories) categoriesMap.set(c, vecs[i++]);
      return { levels: levelsMap, purposes: purposesMap, categories: categoriesMap };
    })();
  }
  return labelEmbeddingsPromise;
}

export interface ClassifyResult {
  queryEmbedding: Float32Array;
  level: { label: Level; score: number } | null;
  purpose: { label: Purpose; score: number } | null;
  category: { label: string; score: number } | null;
  levelScores: Array<{ label: Level; score: number }>;
  purposeScores: Array<{ label: Purpose; score: number }>;
  categoryScores: Array<{ label: string; score: number }>;
}

const LEVEL_THRESHOLD = 0.35;
const PURPOSE_THRESHOLD = 0.35;
const CATEGORY_THRESHOLD = 0.35;

export async function classify(query: string): Promise<ClassifyResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    throw new Error("empty query");
  }

  const [queryVec] = await embed([asQuery(trimmed)]);
  const labelEmbeddings = await getLabelEmbeddings();

  const levelScores = [...labelEmbeddings.levels.entries()]
    .map(([label, vec]) => ({ label, score: cosine(queryVec, vec) }))
    .sort((a, b) => b.score - a.score);

  const purposeScores = [...labelEmbeddings.purposes.entries()]
    .map(([label, vec]) => ({ label, score: cosine(queryVec, vec) }))
    .sort((a, b) => b.score - a.score);

  const categoryScores = [...labelEmbeddings.categories.entries()]
    .map(([label, vec]) => ({ label, score: cosine(queryVec, vec) }))
    .sort((a, b) => b.score - a.score);

  return {
    queryEmbedding: queryVec,
    level: levelScores[0].score >= LEVEL_THRESHOLD ? levelScores[0] : null,
    purpose: purposeScores[0].score >= PURPOSE_THRESHOLD ? purposeScores[0] : null,
    category: categoryScores[0].score >= CATEGORY_THRESHOLD ? categoryScores[0] : null,
    levelScores,
    purposeScores,
    categoryScores,
  };
}

export async function embedText(text: string): Promise<Float32Array> {
  const [vec] = await embed([text]);
  return vec;
}

export function cosineSim(a: Float32Array, b: Float32Array): number {
  return cosine(a, b);
}
