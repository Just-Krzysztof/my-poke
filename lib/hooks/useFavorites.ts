import { useState } from "react";

const STORAGE_KEY = "pokemon-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("favorites") ?? "[]");
  });

  function toggle(id: number) {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function isFavorite(id: number) {
    return favorites.includes(id);
  }

  return { isFavorite, toggle };
}
