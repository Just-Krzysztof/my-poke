import { useState } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import {
  fetchTypes,
  fetchTypeDetail,
  fetchPokemonDetail,
} from "@/lib/api/pokemon";
import type { PokemonDetail } from "@/types/pokemon";

const EXCLUDED_TYPES = ["unknown", "shadow"];
const PER_PAGE = 6;

export function useTypePokemons(typeNames: string[]) {
  const typeKey = typeNames.slice().sort().join(",");
  const [[storedKey, page], setPageState] = useState<[string, number]>([typeKey, 0]);

  const effectivePage = storedKey === typeKey ? page : 0;
  const goToPage = (p: number) => setPageState([typeKey, p]);

  const { data: typesData, isLoading: typesLoading } = useQuery({
    queryKey: ["pokemon-types"],
    queryFn: fetchTypes,
    staleTime: Infinity,
  });

  const typeDetailQueries = useQueries({
    queries: typeNames.map((name) => ({
      queryKey: ["pokemon-type-detail", name],
      queryFn: () => fetchTypeDetail(name),
      enabled: typeNames.length > 0,
    })),
  });

  const allIds = Array.from(
    new Map(
      typeDetailQueries
        .flatMap((q) => q.data?.pokemon ?? [])
        .map(({ pokemon: p }) => {
          const parts = p.url.split("/").filter(Boolean);
          const id = Number(parts[parts.length - 1]);
          return [id, id] as [number, number];
        }),
    ).keys(),
  );

  const totalPages = Math.max(1, Math.ceil(allIds.length / PER_PAGE));
  const pageIds = allIds.slice(effectivePage * PER_PAGE, (effectivePage + 1) * PER_PAGE);

  const detailQueries = useQueries({
    queries: pageIds.map((id) => ({
      queryKey: ["pokemon-detail", id],
      queryFn: () => fetchPokemonDetail(id),
      enabled: typeNames.length > 0,
    })),
  });

  const types = (typesData?.results ?? []).filter(
    (t) => !EXCLUDED_TYPES.includes(t.name),
  );
  const pokemon = detailQueries
    .map((q) => q.data)
    .filter((d): d is PokemonDetail => !!d);
  const isLoading =
    typesLoading ||
    typeDetailQueries.some((q) => q.isLoading) ||
    detailQueries.some((q) => q.isLoading);

  return {
    types,
    pokemon,
    isLoading,
    page: effectivePage,
    totalPages,
    goToPage,
    perPage: PER_PAGE,
  };
}
