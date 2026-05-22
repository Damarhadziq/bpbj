export const generateSummary = (content = '', maxLength = 180) => {
  const normalized = content.replace(/\s+/g, ' ').trim();

  if (normalized.length <= maxLength) return normalized;

  const excerpt = normalized.slice(0, maxLength);
  const lastSentence = Math.max(
    excerpt.lastIndexOf('.'),
    excerpt.lastIndexOf('!'),
    excerpt.lastIndexOf('?')
  );
  const lastSpace = excerpt.lastIndexOf(' ');
  const cutPoint = lastSentence > 80 ? lastSentence + 1 : lastSpace;

  return `${excerpt.slice(0, cutPoint).trim()}...`;
};
