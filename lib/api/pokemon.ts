import type {
  PokemonDetail,
  PokemonListResponse,
  PokemonTypesResponse,
  PokemonTypeDetail,
  PokemonSpecies,
  EvolutionChain,
  PokemonLocation,
} from "@/types/pokemon";

const BASE_URL =
  process.env.NEXT_PUBLIC_POKE_API ?? "https://pokeapi.co/api/v2";

export async function fetchPokemonList(
  limit: number,
  offset: number,
): Promise<PokemonListResponse> {
  const res = await fetch(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
  );
  if (!res.ok) throw new Error("Failed to fetch pokemon list");
  return res.json();
}

export async function fetchPokemonDetail(id: number): Promise<PokemonDetail> {
  const res = await fetch(`${BASE_URL}/pokemon/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch pokemon #${id}`);
  return res.json();
}

export async function fetchPokemonByName(name: string): Promise<PokemonDetail> {
  const res = await fetch(`${BASE_URL}/pokemon/${name.toLowerCase().trim()}`);
  if (!res.ok) throw new Error(`Pokemon "${name}" not found`);
  return res.json();
}

export async function fetchTypes(): Promise<PokemonTypesResponse> {
  const res = await fetch(`${BASE_URL}/type?limit=100`);
  if (!res.ok) throw new Error("Failed to fetch pokemon types");
  return res.json();
}

export async function fetchTypeDetail(
  typeName: string,
): Promise<PokemonTypeDetail> {
  const res = await fetch(`${BASE_URL}/type/${typeName}`);
  if (!res.ok) throw new Error(`Failed to fetch type "${typeName}"`);
  return res.json();
}

export async function fetchPokemonSpecies(id: number): Promise<PokemonSpecies> {
  const res = await fetch(`${BASE_URL}/pokemon-species/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch species for #${id}`);
  return res.json();
}

export async function fetchEvolutionChain(url: string): Promise<EvolutionChain> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch evolution chain");
  return res.json();
}

export async function fetchPokemonLocations(id: number): Promise<PokemonLocation[]> {
  const res = await fetch(`${BASE_URL}/pokemon/${id}/encounters`);
  if (!res.ok) throw new Error(`Failed to fetch locations for #${id}`);
  return res.json();
}
