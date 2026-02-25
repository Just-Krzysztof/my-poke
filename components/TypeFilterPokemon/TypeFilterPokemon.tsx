import type { TFilterPokemonProps } from "./TypeFilterPokemon.types";
import { typeColors } from "@/lib/constants/typeColors";

export const TypeFilterPokemon = ({
  types,
  selectedTypes,
  setSelectedTypes,
}: TFilterPokemonProps) => {
  const toggle = (name: string) => {
    if (selectedTypes.includes(name)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== name));
    } else {
      setSelectedTypes([...selectedTypes, name]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => setSelectedTypes([])}
        className={`capitalize text-xs px-3 py-1 rounded-full border transition-colors cursor-pointer ${
          selectedTypes.length === 0
            ? "bg-foreground text-background"
            : "hover:bg-muted"
        }`}
      >
        Wszystkie
      </button>
      {types.map((t) => {
        const isActive = selectedTypes.includes(t.name);
        return (
          <button
            key={t.name}
            onClick={() => toggle(t.name)}
            className="capitalize text-xs px-3 py-1 rounded-full border transition-colors text-white cursor-pointer"
            style={{
              backgroundColor: typeColors[t.name],
              borderColor: isActive ? "white" : typeColors[t.name],
            }}
          >
            {t.name}
          </button>
        );
      })}
    </div>
  );
};
