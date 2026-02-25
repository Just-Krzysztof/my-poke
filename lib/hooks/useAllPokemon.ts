import { useState } from "react";
import {
  useQuery,
  useQueries,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { fetchPokemonList, fetchPokemonDetail } from "@/lib/api/pokemon";
import type { PokemonDetail, PokemonListResponse } from "@/types/pokemon";

const PER_PAGE = 6;
const PAGES_TO_KEEP = 2;

export function useAllPokemon(enabled = true) {
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  function evictOldPage(newPage: number) {
    const pageToEvict = newPage - PAGES_TO_KEEP - 1;
    if (pageToEvict < 0) return;

    const oldList = queryClient.getQueryData<PokemonListResponse>([
      "pokemon-list",
      PER_PAGE,
      pageToEvict,
    ]);

    oldList?.results.forEach((listItem) => {
      const parts = listItem.url.split("/").filter(Boolean);
      const id = Number(parts[parts.length - 1]);
      queryClient.removeQueries({ queryKey: ["pokemon-detail", id] });
    });

    queryClient.removeQueries({
      queryKey: ["pokemon-list", PER_PAGE, pageToEvict],
    });
  }

  function goToPage(newPage: number) {
    evictOldPage(newPage);
    setPage(newPage);
  }

  const {
    data: list,
    isLoading: listLoading,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["pokemon-list", PER_PAGE, page],
    queryFn: () => fetchPokemonList(PER_PAGE, page * PER_PAGE),
    placeholderData: keepPreviousData,
    enabled,
  });

  const pokemonIds = (list?.results ?? []).map((listItem) => {
    const parts = listItem.url.split("/").filter(Boolean);
    return Number(parts[parts.length - 1]);
  });

  const detailQueries = useQueries({
    queries: pokemonIds.map((id) => ({
      queryKey: ["pokemon-detail", id],
      queryFn: () => fetchPokemonDetail(id),
      enabled,
    })),
  });

  const isLoading =
    listLoading || isPlaceholderData || detailQueries.some((query) => query.isLoading);
  const totalPages = list ? Math.ceil(list.count / PER_PAGE) : 0;
  const pokemon = detailQueries
    .map((detailQuery) => detailQuery.data)
    .filter((data): data is PokemonDetail => !!data);

  return { pokemon, isLoading, totalPages, page, goToPage, perPage: PER_PAGE };
}
