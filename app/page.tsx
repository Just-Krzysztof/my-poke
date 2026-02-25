"use client";

import { useState } from "react";
import { PokemonCard } from "@/components/PokemonCard";
import { PokemonCardSkeleton } from "@/components/PokemonCardSkeleton";
import { Input } from "@/components/ui/input";
import { useAllPokemon } from "@/lib/hooks/useAllPokemon";
import { useSearchPokemon } from "@/lib/hooks/useSearchPokemon";
import { useTypePokemons } from "@/lib/hooks/useTypePokemons";
import { TypeFilterPokemon } from "@/components/TypeFilterPokemon/TypeFilterPokemon";
import { PokemonList } from "@/components/PokemonList/PokemonList";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const isSearching = search.trim().length >= 2;
  const isFilteringByType = selectedTypes.length > 0 && !isSearching;

  const { pokemon, isLoading, totalPages, page, goToPage, perPage } =
    useAllPokemon(!isSearching && !isFilteringByType);
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

  return (
    <main className="min-h-screen p-8 max-w-350 mx-auto">
      <h1 className="text-3xl font-bold mb-4 bg-linear-to-r from-[#FF6D01] to-[#FF9700] bg-clip-text text-transparent">
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
          {searchResult && <PokemonCard pokemon={searchResult} />}
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
        />
      )}

      {!isSearching && !isFilteringByType && (
        <PokemonList
          pokemon={pokemon}
          isLoading={isLoading}
          perPage={perPage}
          page={page}
          totalPages={totalPages}
          goToPage={goToPage}
        />
      )}
    </main>
  );
}
