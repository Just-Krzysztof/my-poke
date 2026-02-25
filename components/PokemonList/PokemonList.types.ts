import type { PokemonDetail } from "@/types/pokemon";

export type PokemonListProps = {
  pokemon: PokemonDetail[];
  isLoading: boolean;
  perPage: number;
  page: number;
  totalPages: number;
  goToPage: (page: number) => void;
};
