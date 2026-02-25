"use client";

import { useState } from "react";
import { PokemonCard } from "@/components/PokemonCard";
import { PokemonCardSkeleton } from "@/components/PokemonCardSkeleton";
import { PokemonDetailModal } from "@/components/PokemonDetailModal/PokemonDetailModal";
import { Input } from "@/components/ui/input";
import { useAllPokemon } from "@/lib/hooks/useAllPokemon";
import { useSearchPokemon } from "@/lib/hooks/useSearchPokemon";
import { useTypePokemons } from "@/lib/hooks/useTypePokemons";
import { useFavoritePokemons } from "@/lib/hooks/useFavoritePokemons";
import { TypeFilterPokemon } from "@/components/TypeFilterPokemon/TypeFilterPokemon";
import { PokemonList } from "@/components/PokemonList/PokemonList";
import type { PokemonDetail } from "@/types/pokemon";
import pokeBall from "@/public/poke-ball.png";
import Image from "next/image";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetail | null>(
    null,
  );

  const isSearching = search.trim().length >= 2;
  const isFilteringByType = selectedTypes.length > 0 && !isSearching && !showFavorites;

  const { pokemon, isLoading, totalPages, page, goToPage, perPage } =
    useAllPokemon(!isSearching && !isFilteringByType && !showFavorites);
  const {
    result: searchResult,
    isLoading: searchLoading,
    isError: searchError,
  } = useSearchPokemon(search);
  const {
    types,
    pokemon: typePokemon,
    isLoading: typeLoading,
    page: typePage,
    totalPages: typeTotalPages,
    goToPage: typeGoToPage,
    perPage: typePerPage,
  } = useTypePokemons(isFilteringByType ? selectedTypes : []);
  const {
    pokemon: favoritePokemon,
    isLoading: favoritesLoading,
    count: favoritesCount,
    page: favoritePage,
    totalPages: favoriteTotalPages,
    goToPage: favoriteGoToPage,
    perPage: favoritePerPage,
  } = useFavoritePokemons();

  return (
    <main className="min-h-screen p-8 max-w-350 mx-auto">
      <h1 className="text-3xl font-bold mb-4 bg-linear-to-r from-[#FF6D01] to-[#FF9700] bg-clip-text text-transparent">
        <Image
          src={pokeBall}
          alt="Poke ball"
          width={32}
          height={32}
          className="inline mr-2"
        />
        Pokemon Explorer
      </h1>

      <Input
        placeholder="Szukaj pokemona po nazwie..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setSelectedTypes([]);
        }}
        className="mb-4 max-w-sm"
      />

      {!isSearching && (
        <TypeFilterPokemon
          types={types}
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
          favoritesCount={favoritesCount}
        />
      )}

      {isSearching && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchLoading && <PokemonCardSkeleton />}
          {searchError && (
            <p className="text-red-500 col-span-full">
              Nie znaleziono pokemona &quot;{search}&quot;
            </p>
          )}
          {searchResult && (
            <PokemonCard
              pokemon={searchResult}
              onClick={() => setSelectedPokemon(searchResult)}
            />
          )}
        </div>
      )}

      {isFilteringByType && (
        <PokemonList
          pokemon={typePokemon}
          isLoading={typeLoading}
          perPage={typePerPage}
          page={typePage}
          totalPages={typeTotalPages}
          goToPage={typeGoToPage}
          onSelect={setSelectedPokemon}
        />
      )}

      {showFavorites && !isSearching && (
        <PokemonList
          pokemon={favoritePokemon}
          isLoading={favoritesLoading}
          perPage={favoritePerPage}
          page={favoritePage}
          totalPages={favoriteTotalPages}
          goToPage={favoriteGoToPage}
          onSelect={setSelectedPokemon}
        />
      )}

      {!isSearching && !isFilteringByType && !showFavorites && (
        <PokemonList
          pokemon={pokemon}
          isLoading={isLoading}
          perPage={perPage}
          page={page}
          totalPages={totalPages}
          goToPage={goToPage}
          onSelect={setSelectedPokemon}
        />
      )}

      <PokemonDetailModal
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
      />
    </main>
  );
}
