export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonTypeListItem {
  name: string;
  url: string;
}

export interface PokemonTypesResponse {
  count: number;
  results: PokemonTypeListItem[];
}

export interface PokemonTypeDetail {
  id: number;
  name: string;
  pokemon: {
    pokemon: { name: string; url: string };
    slot: number;
  }[];
}

export interface PokemonStat {
  base_stat: number;
  stat: { name: string };
}

export interface PokemonAbility {
  ability: { name: string };
  is_hidden: boolean;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonType[];
  sprites: {
    front_default: string | null;
    front_shiny: string | null;
    back_default: string | null;
    back_shiny: string | null;
    other: {
      "official-artwork": {
        front_default: string;
        front_shiny: string | null;
      };
      home: {
        front_default: string | null;
        front_shiny: string | null;
      };
    };
  };
  stats: PokemonStat[];
  abilities: PokemonAbility[];
}

export interface PokemonSpecies {
  evolution_chain: { url: string };
}

export interface EvolutionChainLink {
  species: { name: string; url: string };
  evolves_to: EvolutionChainLink[];
}

export interface EvolutionChain {
  chain: EvolutionChainLink;
}

export interface PokemonLocation {
  location_area: { name: string; url: string };
  version_details: {
    version: { name: string };
  }[];
}
