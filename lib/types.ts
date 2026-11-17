export type Sentiment = "positive" | "negative" | "neutral";

export interface ThreadsPost {
  id: string;
  text: string;
  username?: string;
  permalink?: string;
  timestamp?: string;
}

export interface ClassifiedPost extends ThreadsPost {
  sentiment: Sentiment;
}

export interface AnalyzeResult {
  brand: string;
  analyzedAt: string;
  totalFetched: number;
  /** Пости, де бренд згадано не в тому значенні (наприклад, "apple" як фрукт) */
  irrelevant: number;
  counts: Record<Sentiment, number>;
  posts: Record<Sentiment, ClassifiedPost[]>;
  source: "threads" | "demo";
  classifier: "claude" | "lexicon";
  cached: boolean;
  notes: string[];
}
