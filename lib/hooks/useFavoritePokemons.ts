import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { fetchPokemonDetail } from "@/lib/api/pokemon";
import { useFavorites } from "@/lib/context/FavoritesContext";
import type { PokemonDetail } from "@/types/pokemon";

const PER_PAGE = 6;

export function useFavoritePokemons() {
  const { favoriteIds } = useFavorites();
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(favoriteIds.length / PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const pageIds = favoriteIds.slice(safePage * PER_PAGE, (safePage + 1) * PER_PAGE);

  const queries = useQueries({
    queries: pageIds.map((id) => ({
      queryKey: ["pokemon-detail", id],
      queryFn: () => fetchPokemonDetail(id),
      staleTime: Infinity,
    })),
  });

  const pokemon = queries
    .map((query) => query.data)
    .filter((data): data is PokemonDetail => !!data);

  const isLoading = queries.some((query) => query.isLoading);

  return {
    pokemon,
    isLoading,
    count: favoriteIds.length,
    page: safePage,
    totalPages,
    goToPage: setPage,
    perPage: PER_PAGE,
  };
}
