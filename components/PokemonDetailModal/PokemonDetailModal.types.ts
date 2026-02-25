import type { PokemonDetail } from "@/types/pokemon";

export type PokemonDetailModalProps = {
  pokemon: PokemonDetail | null;
  onClose: () => void;
};

export type StatBarProps = {
  name: string;
  value: number;
};

export const STAT_MAX = 255;

export const statLabels: Record<string, string> = {
  hp: "HP",
  attack: "Atak",
  defense: "Obrona",
  "special-attack": "Sp. Atak",
  "special-defense": "Sp. Obrona",
  speed: "Szybkość",
};

export const SPRITE_ARTWORK_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";
