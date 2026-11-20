export const addAiContinuationPrompt = (value) => {
  const text = String(value || "").trim();
  if (
    !text ||
    text.endsWith("?") ||
    /would you like me to explain more or show a related detail\?$/i.test(text) ||
    /^(i couldn't identify|i couldn't find|please include|that date is not valid|unable to|sorry,)/i.test(text)
  ) {
    return text;
  }

  return `${text}\n\nWould you like me to explain more or show a related detail?`;
};
