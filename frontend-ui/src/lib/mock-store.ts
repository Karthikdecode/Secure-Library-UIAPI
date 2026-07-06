import { useEffect, useState } from "react";

export type Author = {
  id: string;
  name: string;
  biography: string;
  books: number;
  createdAt: string;
};

export type Book = {
  id: string;
  title: string;
  description: string;
  authorId: string;
  price: number;
  createdAt: string;
};

export type UploadedImage = {
  id: string;
  name: string;
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  uploadedAt: string;
  status: "success" | "failed";
};

const AK = "lms_authors";
const BK = "lms_books";
const IK = "lms_images";

const seedAuthors: Author[] = [
  { id: "a1", name: "J.R.R. Tolkien", biography: "English author of The Lord of the Rings.", books: 2, createdAt: "2024-11-02" },
  { id: "a2", name: "Agatha Christie", biography: "Queen of mystery novels.", books: 1, createdAt: "2024-12-15" },
  { id: "a3", name: "Isaac Asimov", biography: "Prolific science fiction writer.", books: 1, createdAt: "2025-01-20" },
];

const seedBooks: Book[] = [
  { id: "b1", title: "The Hobbit", description: "A fantasy adventure.", authorId: "a1", price: 19.99, createdAt: "2024-11-10" },
  { id: "b2", title: "The Fellowship of the Ring", description: "First LOTR book.", authorId: "a1", price: 24.99, createdAt: "2024-11-12" },
  { id: "b3", title: "Murder on the Orient Express", description: "A classic mystery.", authorId: "a2", price: 14.5, createdAt: "2024-12-20" },
  { id: "b4", title: "Foundation", description: "Sci-fi epic.", authorId: "a3", price: 17.99, createdAt: "2025-01-25" },
];

function load<T>(key: string, seed: T[]): T[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}

function save<T>(key: string, val: T[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(val));
  window.dispatchEvent(new CustomEvent("lms-store-change", { detail: key }));
}

function useStore<T>(key: string, seed: T[]) {
  const [data, setData] = useState<T[]>(seed);
  useEffect(() => {
    setData(load(key, seed));
    const h = () => setData(load(key, seed));
    window.addEventListener("lms-store-change", h);
    return () => window.removeEventListener("lms-store-change", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const write = (next: T[]) => {
    save(key, next);
    setData(next);
  };
  return [data, write] as const;
}

export const useAuthors = () => useStore<Author>(AK, seedAuthors);
export const useBooks = () => useStore<Book>(BK, seedBooks);
export const useImages = () => useStore<UploadedImage>(IK, []);

export const uid = () => Math.random().toString(36).slice(2, 10);