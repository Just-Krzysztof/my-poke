import type { TFilterPokemonProps } from "./TypeFilterPokemon.types";
import { typeColors } from "@/lib/constants/typeColors";

export const TypeFilterPokemon = ({
  types,
  selectedTypes,
  setSelectedTypes,
  showFavorites,
  setShowFavorites,
  favoritesCount,
}: TFilterPokemonProps) => {
  const toggleType = (name: string) => {
    setShowFavorites(false);
    if (selectedTypes.includes(name)) {
      setSelectedTypes(selectedTypes.filter((type) => type !== name));
    } else {
      setSelectedTypes([...selectedTypes, name]);
    }
  };

  const handleAll = () => {
    setShowFavorites(false);
    setSelectedTypes([]);
  };

  const handleFavorites = () => {
    setSelectedTypes([]);
    setShowFavorites(true);
  };

  const noneActive = !showFavorites && selectedTypes.length === 0;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={handleAll}
        className={`capitalize text-xs px-3 py-1 rounded-full border transition-colors cursor-pointer ${
          noneActive ? "bg-foreground text-background" : "hover:bg-muted"
        }`}
      >
        Wszystkie
      </button>

      <button
        onClick={handleFavorites}
        className={`text-xs px-3 py-1 rounded-full border transition-colors cursor-pointer ${
          showFavorites
            ? "bg-foreground text-background"
            : "hover:bg-muted"
        }`}
      >
        ★ Ulubione {favoritesCount > 0 && `(${favoritesCount})`}
      </button>

      {types.map((type) => {
        const isActive = selectedTypes.includes(type.name);
        return (
          <button
            key={type.name}
            onClick={() => toggleType(type.name)}
            className="capitalize text-xs px-3 py-1 rounded-full border transition-colors text-white cursor-pointer"
            style={{
              backgroundColor: typeColors[type.name],
              borderColor: isActive ? "white" : typeColors[type.name],
            }}
          >
            {type.name}
          </button>
        );
      })}
    </div>
  );
};
