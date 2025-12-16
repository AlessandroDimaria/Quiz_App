export function loadUserStats() {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem("quizStats");
  return raw ? JSON.parse(raw) : {};
}

export function saveUserStats(categoryId, categoryName, score) {
  if (typeof window === "undefined") return;

  const raw = localStorage.getItem("quizStats");
  const data = raw ? JSON.parse(raw) : {};

  const entry = data[categoryId] || {
    categoryName,
    plays: 0,
    bestScore: 0,
    lastScore: 0,
    averageScore: 0,
  };

  entry.plays += 1;
  entry.lastScore = score;
  entry.bestScore = Math.max(entry.bestScore, score);
  entry.averageScore =
    ((entry.averageScore * (entry.plays - 1)) + score) / entry.plays;

  data[categoryId] = entry;

  localStorage.setItem("quizStats", JSON.stringify(data));
}