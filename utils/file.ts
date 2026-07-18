const domain = process.env.EXPO_PUBLIC_FILE_DOMAIN ?? "";

export const getFileUrl = (imgId: string) => {
  if (!imgId) return "";
  // Nếu đã là full URL (https/http) thì trả về luôn, không cần ghép domain
  if (imgId.startsWith("http://") || imgId.startsWith("https://")) return imgId;
  return `${domain}/${imgId}`;
};
