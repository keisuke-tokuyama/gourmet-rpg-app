/**
 * RPGレベル計算ロジック
 * - 1投稿: 100 XP
 * - いいね1つ（他者から）: 20 XP
 */

export const XP_PER_POST = 100;
export const XP_PER_LIKE = 20;

/** レベルNに到達するのに必要な累計XP (level 1 = 0, level 2 = 200, level 3 = 500, ...) */
function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(200 * Math.pow(1.5, level - 2));
}

/** XPから現在のレベルを算出 */
export function xpToLevel(xp: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) {
    level++;
    if (level >= 99) break;
  }
  return level;
}

/** 次のレベルまでの必要XP */
export function xpToNextLevel(currentXp: number): { required: number; progress: number } {
  const level = xpToLevel(currentXp);
  const currentThreshold = xpForLevel(level);
  const nextThreshold = xpForLevel(level + 1);
  const required = nextThreshold - currentThreshold;
  const progress = currentXp - currentThreshold;
  return { required, progress };
}

/** XPに応じた称号 */
const TITLE_TIERS: { xp: number; title: string }[] = [
  { xp: 0, title: "食の見習い" },
  { xp: 200, title: "パスタの求道者" },
  { xp: 500, title: "美食の探求者" },
  { xp: 1000, title: "美食の富豪" },
  { xp: 2000, title: "伝説の美食家" },
  { xp: 5000, title: "食の王" },
];

export function xpToTitle(xp: number): string {
  let result = TITLE_TIERS[0].title;
  for (const tier of TITLE_TIERS) {
    if (xp >= tier.xp) result = tier.title;
  }
  return result;
}
