/**
 * Smart answer evaluator for English translation practice.
 * Handles case insensitivity, punctuation stripping, contraction expansion/collapse,
 * multiple accepted answers, and fuzzy typo detection.
 */

const CONTRACTION_MAP: Record<string, string> = {
  "i'm": "i am",
  "im": "i am",
  "don't": "do not",
  "dont": "do not",
  "doesn't": "does not",
  "doesnt": "does not",
  "didn't": "did not",
  "didnt": "did not",
  "can't": "cannot",
  "cant": "cannot",
  "won't": "will not",
  "wont": "will not",
  "it's": "it is",
  "its": "it is",
  "that's": "that is",
  "thats": "that is",
  "what's": "what is",
  "whats": "what is",
  "there's": "there is",
  "theres": "there is",
  "you're": "you are",
  "youre": "you are",
  "we're": "we are",
  "were": "we are", // handled carefully in context
  "they're": "they are",
  "theyre": "they are",
  "i've": "i have",
  "ive": "i have",
  "you've": "you have",
  "youve": "you have",
  "we've": "we have",
  "weve": "we have",
  "they've": "they have",
  "theyve": "they have",
  "i'll": "i will",
  "ill": "i will",
  "you'll": "you will",
  "youll": "you will",
  "he'll": "he will",
  "hell": "he will",
  "she'll": "she will",
  "shell": "she will",
  "we'll": "we will",
  "they'll": "they will",
  "he's": "he is",
  "hes": "he is",
  "she's": "she is",
  "shes": "she is",
  "let's": "let us",
  "lets": "let us",
  "isn't": "is not",
  "isnt": "is not",
  "aren't": "are not",
  "arent": "are not",
  "wasn't": "was not",
  "wasnt": "was not",
  "weren't": "were not",
  "werent": "were not",
  "haven't": "have not",
  "havent": "have not",
  "hasn't": "has not",
  "hasnt": "has not",
  "hadn't": "had not",
  "hadnt": "had not",
  "wouldn't": "would not",
  "wouldnt": "would not",
  "shouldn't": "should not",
  "shouldnt": "should not",
  "couldn't": "could not",
  "couldnt": "could not"
};

export function cleanAndNormalize(text: string): string {
  if (!text) return '';
  let str = text
    .toLowerCase()
    .trim()
    // normalize curly quotes to straight
    .replace(/[‘’`]/g, "'")
    .replace(/[“”]/g, '"')
    // remove punctuation characters except internal apostrophe for now
    .replace(/[.,/#!$%^&*;:{}=\-_~()?]/g, ' ')
    // collapse multiple spaces
    .replace(/\s+/g, ' ')
    .trim();

  // Normalize tokens by expanding contractions
  const tokens = str.split(' ').map((token) => {
    const unApos = token.replace(/'/g, '');
    if (CONTRACTION_MAP[token]) return CONTRACTION_MAP[token];
    if (CONTRACTION_MAP[unApos]) return CONTRACTION_MAP[unApos];
    return token;
  });

  return tokens.join(' ').replace(/\s+/g, ' ').trim();
}

/**
 * Calculates Levenshtein edit distance between two strings
 */
export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[m][n];
}

/**
 * Similarity ratio between 0 and 1
 */
export function similarityRatio(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  const longerLength = longer.length;
  if (longerLength === 0) return 1.0;
  return (longerLength - levenshteinDistance(longer, shorter)) / longerLength;
}

export interface EvaluationResult {
  isCorrect: boolean;
  isClose: boolean;
  similarity: number;
  matchedAnswer?: string;
  feedbackTitle: string;
  feedbackMessage: string;
}

export function evaluateAnswer(
  userText: string,
  modelAnswer: string,
  alternatives: string[] = []
): EvaluationResult {
  const trimmed = userText.trim();
  if (!trimmed) {
    return {
      isCorrect: false,
      isClose: false,
      similarity: 0,
      feedbackTitle: 'উত্তর ফাঁকা!',
      feedbackMessage: 'অনুগ্রহ করে বক্সে আপনার ইংরেজি অনুবাদ লিখুন।'
    };
  }

  const normalizedUser = cleanAndNormalize(trimmed);
  const allTargets = [modelAnswer, ...alternatives];

  let bestSim = 0;
  let bestTarget = modelAnswer;

  for (const target of allTargets) {
    const normTarget = cleanAndNormalize(target);

    // Exact normalized match
    if (normalizedUser === normTarget) {
      return {
        isCorrect: true,
        isClose: false,
        similarity: 1.0,
        matchedAnswer: target,
        feedbackTitle: 'চমৎকার! সঠিক হয়েছে 🎉',
        feedbackMessage: 'আপনার অনুবাদটি সম্পূর্ণ নির্ভুল ও প্রাকৃতিক।'
      };
    }

    const sim = similarityRatio(normalizedUser, normTarget);
    if (sim > bestSim) {
      bestSim = sim;
      bestTarget = target;
    }
  }

  // If similarity is very high (> 0.88), likely a typo or missing letter
  if (bestSim >= 0.88) {
    return {
      isCorrect: true,
      isClose: true,
      similarity: bestSim,
      matchedAnswer: bestTarget,
      feedbackTitle: 'প্রায় সঠিক! (ছোট বানানের অসঙ্গতি) 👍',
      feedbackMessage: `উত্তরটি সঠিক ধরা হয়েছে, তবে বানানের প্রতি খেয়াল রাখুন: "${bestTarget}"`
    };
  }

  // If similarity is between 0.70 and 0.87, encourage and show model answer
  if (bestSim >= 0.70) {
    return {
      isCorrect: false,
      isClose: true,
      similarity: bestSim,
      matchedAnswer: bestTarget,
      feedbackTitle: 'খুব কাছাকাছি এসেছিলেন! একটু পরিমার্জন করুন',
      feedbackMessage: `আদর্শ উত্তর ও ব্যাকরণগত ব্যাখ্যাটি নিচে দেখুন এবং পুনরায় চেষ্টা করুন।`
    };
  }

  return {
    isCorrect: false,
    isClose: false,
    similarity: bestSim,
    matchedAnswer: bestTarget,
    feedbackTitle: 'সঠিক হয়নি, হতাশ হবেন না!',
    feedbackMessage: 'নিচের মডেল অনুবাদ ও ব্যাকরণ টিপস পড়ে শিখে নিন।'
  };
}
