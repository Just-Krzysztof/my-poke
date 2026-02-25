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

export interface PokemonDetail {
  id: number;
  name: string;
  types: PokemonType[];
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
}
