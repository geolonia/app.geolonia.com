export const normalizeOrigin = (url: string) => {
  const trimed = url.trim();
  if (trimed[trimed.length - 1] === "/") {
    return trimed.slice(0, trimed.length - 1);
  } else {
    return trimed;
  }
};

export default normalizeOrigin;
