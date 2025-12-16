export const playSound = (soundPath, volume = 0.6) => {
  try {
    const audio = new Audio(soundPath);
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch {}
};
