import Image from "next/image";
import { typeColors } from "@/lib/constants/typeColors";
import { Badge } from "@/components/ui/badge";
import {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  DialogRoot,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  usePokemonExtraData,
  formatLocationName,
} from "@/lib/hooks/usePokemonExtraData";
import {
  STAT_MAX,
  SPRITE_ARTWORK_BASE,
  statLabels,
  type PokemonDetailModalProps,
  type StatBarProps,
} from "./PokemonDetailModal.types";

function StatBar({ name, value }: StatBarProps) {
  const pct = Math.round((value / STAT_MAX) * 100);
  return (
    <div className="grid grid-cols-[7rem_2.5rem_1fr] items-center gap-2 text-sm">
      <span className="text-muted-foreground">{statLabels[name] ?? name}</span>
      <span className="text-right font-mono font-medium">{value}</span>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function PokemonDetailModal({
  pokemon,
  onClose,
}: PokemonDetailModalProps) {
  const {
    evolutionStages,
    locations,
    isLoading: extraLoading,
  } = usePokemonExtraData(pokemon?.id ?? null);

  const artworkUrl =
    pokemon?.sprites.other["official-artwork"].front_default ?? null;
  const color1 = typeColors[pokemon?.types[0]?.type.name ?? ""] ?? "#A8A77A";
  const color2 = typeColors[pokemon?.types[1]?.type.name ?? ""] ?? color1;
  const bg =
    pokemon && pokemon.types.length > 1
      ? `linear-gradient(90deg, ${color1}, ${color2})`
      : color1;

  const sprites = pokemon
    ? [
        {
          label: "Normalny",
          url: pokemon.sprites.other["official-artwork"].front_default,
        },
        {
          label: "Shiny",
          url: pokemon.sprites.other["official-artwork"].front_shiny,
        },
        { label: "Home", url: pokemon.sprites.other.home.front_default },
        { label: "Home Shiny", url: pokemon.sprites.other.home.front_shiny },
        { label: "Przód", url: pokemon.sprites.front_default },
        { label: "Przód Shiny", url: pokemon.sprites.front_shiny },
        { label: "Tył", url: pokemon.sprites.back_default },
        { label: "Tył Shiny", url: pokemon.sprites.back_shiny },
      ].filter((s) => !!s.url)
    : [];

  return (
    <DialogRoot open={!!pokemon} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <div
          className="flex flex-col items-center gap-2 py-6 shrink-0"
          style={{ background: bg }}
        >
          {artworkUrl && (
            <Image
              src={artworkUrl}
              alt={pokemon!.name}
              width={120}
              height={120}
              className="drop-shadow-lg"
            />
          )}
          <DialogTitle className="capitalize text-2xl text-white font-bold">
            {pokemon?.name}
          </DialogTitle>
          <DialogDescription className="text-white/80 font-mono text-sm">
            #{String(pokemon?.id).padStart(4, "0")}
          </DialogDescription>
          <div className="flex gap-1 flex-wrap justify-center">
            {pokemon?.types.map(({ type }) => (
              <Badge
                key={type.name}
                variant="secondary"
                className="capitalize bg-white/30 text-white border-0"
              >
                {type.name}
              </Badge>
            ))}
          </div>
        </div>

        <TabsRoot
          defaultValue="info"
          className="flex flex-col flex-1 overflow-hidden cursor-pointer"
        >
          <TabsList className="mx-auto mt-2 shrink-0">
            <TabsTrigger value="info" className="cursor-pointer">
              Informacje
            </TabsTrigger>
            <TabsTrigger value="sprites" className="cursor-pointer">
              Sprite&apos;y
            </TabsTrigger>
            <TabsTrigger value="evolution" className="cursor-pointer">
              Ewolucje
            </TabsTrigger>
            <TabsTrigger value="locations" className="cursor-pointer">
              Lokacje
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="info"
            className="overflow-y-auto px-5 py-4 flex flex-col gap-4"
          >
            <div className="flex justify-around text-center text-sm">
              <div>
                <p className="text-muted-foreground">Wzrost</p>
                <p className="font-semibold">
                  {((pokemon?.height ?? 0) / 10).toFixed(1)} m
                </p>
              </div>
              <div className="border-l" />
              <div>
                <p className="text-muted-foreground">Waga</p>
                <p className="font-semibold">
                  {((pokemon?.weight ?? 0) / 10).toFixed(1)} kg
                </p>
              </div>
              <div className="border-l" />
              <div>
                <p className="text-muted-foreground">Zdolności</p>
                <p className="font-semibold capitalize">
                  {pokemon?.abilities
                    .filter((ability) => !ability.is_hidden)
                    .map((ability) => ability.ability.name)
                    .join(", ")}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-sm">Statystyki</p>
              {pokemon?.stats.map((stat) => (
                <StatBar
                  key={stat.stat.name}
                  name={stat.stat.name}
                  value={stat.base_stat}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sprites" className="overflow-y-auto px-5 py-4">
            <div className="grid grid-cols-2 gap-3">
              {sprites.map((sprite) => (
                <div
                  key={sprite.label}
                  className="flex flex-col items-center gap-1 rounded-xl bg-muted p-3"
                >
                  <Image
                    src={sprite.url!}
                    alt={sprite.label}
                    width={96}
                    height={96}
                    className="object-contain"
                  />
                  <span className="text-xs text-muted-foreground">
                    {sprite.label}
                  </span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="evolution" className="overflow-y-auto px-2 py-4">
            {extraLoading && (
              <p className="text-sm text-muted-foreground text-center">
                Ładowanie...
              </p>
            )}
            {!extraLoading && evolutionStages && (
              <div className="flex flex-col items-center gap-3">
                {evolutionStages.map((stage, stageIdx) => (
                  <div
                    key={stageIdx}
                    className="flex flex-col items-center gap-2 w-full"
                  >
                    {stageIdx > 0 && (
                      <span className="text-muted-foreground text-lg">↓</span>
                    )}
                    <div className="flex flex-wrap justify-center gap-3">
                      {stage.map((evolution) => (
                        <div
                          key={evolution.id}
                          className="flex flex-col items-center gap-1 rounded-xl bg-muted p-3 min-w-20"
                        >
                          <Image
                            src={`${SPRITE_ARTWORK_BASE}/${evolution.id}.png`}
                            alt={evolution.name}
                            width={64}
                            height={64}
                            className="object-contain"
                          />
                          <span className="text-xs capitalize font-medium">
                            {evolution.name}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">
                            #{String(evolution.id).padStart(4, "0")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="locations" className="overflow-y-auto px-5 py-4">
            {extraLoading && (
              <p className="text-sm text-muted-foreground text-center">
                Ładowanie...
              </p>
            )}
            {!extraLoading && locations.length === 0 && (
              <p className="text-sm text-muted-foreground text-center">
                Brak znanych lokacji w grach.
              </p>
            )}
            {!extraLoading && locations.length > 0 && (
              <ul className="flex flex-col gap-2">
                {locations.map((loc) => (
                  <li
                    key={loc.location_area.name}
                    className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm"
                  >
                    <span>{formatLocationName(loc.location_area.name)}</span>
                    <span className="text-xs text-muted-foreground">
                      {loc.version_details
                        .map((versionDetail) => versionDetail.version.name)
                        .join(", ")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        </TabsRoot>
      </DialogContent>
    </DialogRoot>
  );
}
