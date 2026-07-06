export type Theme = "light" | "dark";

export const getTheme = (): Theme => {
  if (typeof window === "undefined") return "light";

  return (localStorage.getItem("theme") as Theme) || "light";
};

export const setTheme = (theme: Theme) => {
  const html = document.documentElement;

  if (theme === "dark") {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }

  localStorage.setItem("theme", theme);
};

