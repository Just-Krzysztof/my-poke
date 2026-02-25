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
  const [[storedKey, page], setPageState] = useState<[string, number]>([
    typeKey,
    0,
  ]);

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
        .flatMap((typeQuery) => typeQuery.data?.pokemon ?? [])
        .map(({ pokemon: pokemonEntry }) => {
          const parts = pokemonEntry.url.split("/").filter(Boolean);
          const id = Number(parts[parts.length - 1]);
          return [id, id] as [number, number];
        }),
    ).keys(),
  );

  const totalPages = Math.max(1, Math.ceil(allIds.length / PER_PAGE));
  const pageIds = allIds.slice(
    effectivePage * PER_PAGE,
    (effectivePage + 1) * PER_PAGE,
  );

  const detailQueries = useQueries({
    queries: pageIds.map((id) => ({
      queryKey: ["pokemon-detail", id],
      queryFn: () => fetchPokemonDetail(id),
      enabled: typeNames.length > 0,
    })),
  });

  const types = (typesData?.results ?? []).filter(
    (type) => !EXCLUDED_TYPES.includes(type.name),
  );
  const pokemon = detailQueries
    .map((detailQuery) => detailQuery.data)
    .filter((data): data is PokemonDetail => !!data);
  const isLoading =
    typesLoading ||
    typeDetailQueries.some((query) => query.isLoading) ||
    detailQueries.some((query) => query.isLoading);

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
