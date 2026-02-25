import { useQuery } from "@tanstack/react-query";
import {
  fetchPokemonSpecies,
  fetchEvolutionChain,
  fetchPokemonLocations,
} from "@/lib/api/pokemon";
import type { EvolutionChainLink, PokemonLocation } from "@/types/pokemon";

export interface EvolutionStage {
  name: string;
  id: number;
}

function getIdFromUrl(url: string): number {
  const parts = url.split("/").filter(Boolean);
  return Number(parts[parts.length - 1]);
}

function buildStages(
  link: EvolutionChainLink,
  depth = 0,
  stages: EvolutionStage[][] = [],
): EvolutionStage[][] {
  if (!stages[depth]) stages[depth] = [];
  stages[depth].push({ name: link.species.name, id: getIdFromUrl(link.species.url) });
  link.evolves_to.forEach((child) => buildStages(child, depth + 1, stages));
  return stages;
}

export function formatLocationName(name: string): string {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function usePokemonExtraData(pokemonId: number | null) {
  const enabled = pokemonId !== null;

  const speciesQuery = useQuery({
    queryKey: ["pokemon-species", pokemonId],
    queryFn: () => fetchPokemonSpecies(pokemonId!),
    enabled,
    staleTime: Infinity,
  });

  const evolutionChainUrl = speciesQuery.data?.evolution_chain.url ?? null;

  const evolutionQuery = useQuery({
    queryKey: ["evolution-chain", evolutionChainUrl],
    queryFn: () => fetchEvolutionChain(evolutionChainUrl!),
    enabled: !!evolutionChainUrl,
    staleTime: Infinity,
  });

  const locationsQuery = useQuery({
    queryKey: ["pokemon-locations", pokemonId],
    queryFn: () => fetchPokemonLocations(pokemonId!),
    enabled,
    staleTime: Infinity,
  });

  const evolutionStages = evolutionQuery.data
    ? buildStages(evolutionQuery.data.chain)
    : null;

  const locations: PokemonLocation[] = locationsQuery.data ?? [];

  return {
    evolutionStages,
    locations,
    isLoading:
      speciesQuery.isLoading ||
      evolutionQuery.isLoading ||
      locationsQuery.isLoading,
  };
}
