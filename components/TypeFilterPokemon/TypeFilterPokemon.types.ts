export type TPokemon = {
  name: string;
  url: string;
};

export type TFilterPokemonProps = {
  types: TPokemon[];
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
};
