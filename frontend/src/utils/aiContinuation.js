export const addAiContinuationPrompt = (value) => {
  const text = String(value || "").trim();
  if (
    !text ||
    text.endsWith("?") ||
    /would you like (?:me to explain more|to get more in details|to explore more)/i.test(text) ||
    /^(i couldn't identify|i couldn't find|please include|that date is not valid|unable to|sorry,|no problem!|haha,|hey!)/i.test(text)
  ) {
    return text;
  }

  return `${text}\n\nWould you like to get more in details or explore related info?`;
};
