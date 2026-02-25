import Image from "next/image";
import { typeColors } from "@/lib/constants/typeColors";
import type { PokemonDetail } from "@/types/pokemon";
import { Badge } from "@/components/ui/badge";

export function PokemonCard({ pokemon }: { pokemon: PokemonDetail }) {
  const artworkUrl = pokemon.sprites.other["official-artwork"].front_default;
  const color1 = typeColors[pokemon.types[0]?.type.name] ?? "#A8A77A";
  const color2 = typeColors[pokemon.types[1]?.type.name] ?? "#A8A77A";
  const bg =
    pokemon.types.length > 1
      ? `linear-gradient(90deg, ${color1}, ${color2})`
      : color1;

  return (
    <div
      className="rounded-2xl p-4 flex flex-col items-center gap-2 shadow-md"
      style={{ background: bg }}
    >
      {/* <pre>{JSON.stringify(pokemon.types, null, 2)}</pre> */}

      {artworkUrl && (
        <Image
          src={artworkUrl}
          alt={pokemon.name}
          width={80}
          height={80}
          className="drop-shadow-md"
        />
      )}

      <p className="capitalize font-semibold text-white">{pokemon.name}</p>

      <span className="text-xs font-mono text-white">
        #{String(pokemon.id).padStart(4, "0")}
      </span>

      <div className="flex gap-1 flex-wrap justify-center">
        {pokemon.types.map(({ type }) => (
          <Badge
            variant="secondary"
            key={type.name}
            className="capitalize bg-muted/40 text-white"
          >
            {type.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
