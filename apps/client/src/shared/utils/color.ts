import color from 'color';

export const withOpacity = (baseColor: string, opacity: number) => {
  try {
    return color(baseColor).alpha(opacity).rgb().string();
  } catch {
    return baseColor; // fallback
  }
};