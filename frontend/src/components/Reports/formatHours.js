export const roundHours = (value) => {
  const numericValue = Number(value || 0);
  return (
    Math.sign(numericValue) *
    (Math.round((Math.abs(numericValue) + Number.EPSILON) * 100) / 100)
  );
};

export const formatHours = (value) => roundHours(value).toFixed(2);
