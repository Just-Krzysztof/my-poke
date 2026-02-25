import { useQuery } from "@tanstack/react-query";
import { fetchPokemonByName } from "@/lib/api/pokemon";

export function useSearchPokemon(name: string) {
  const trimmed = name.trim().toLowerCase();
  const enabled = trimmed.length >= 2;

  const { data: result, isLoading, isError } = useQuery({
    queryKey: ["pokemon-search", trimmed],
    queryFn: () => fetchPokemonByName(trimmed),
    enabled,
    retry: false,
  });

  return { result, isLoading, isError, isActive: enabled };
}
