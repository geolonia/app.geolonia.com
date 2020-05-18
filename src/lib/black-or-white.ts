const blackOrWhite = (hexcolor: string) => {
  if (!hexcolor.startsWith("#")) {
    return "#000000";
  }

  const r = parseInt(hexcolor.substr(1, 2), 16);
  const g = parseInt(hexcolor.substr(3, 2), 16);
  const b = parseInt(hexcolor.substr(5, 2), 16);

  return (r * 299 + g * 587 + b * 114) / 1000 < 128 ? "#FFFFFF" : "#000000";
};

export default blackOrWhite;
