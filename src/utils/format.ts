export const uuidLastStr = (uuid: string, length = -6) => uuid.slice(length);

export const codeStr = (code: number) => {
  if (!code) return "000000";
  return code.toString().padStart(6, "0");
};

export const formatNumber = (number: number) => {
  if (!number) return "0";
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
