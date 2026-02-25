import { PokemonCard } from "@/components/PokemonCard";
import { PokemonCardSkeleton } from "@/components/PokemonCardSkeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { PokemonListProps } from "./PokemonList.types";

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);

  const pages: (number | "...")[] = [0];
  if (current > 2) pages.push("...");
  for (
    let i = Math.max(1, current - 1);
    i <= Math.min(total - 2, current + 1);
    i++
  ) {
    pages.push(i);
  }
  if (current < total - 3) pages.push("...");
  pages.push(total - 1);
  return pages;
}

export const PokemonList = ({
  pokemon,
  isLoading,
  perPage,
  page,
  totalPages,
  goToPage,
  onSelect,
}: PokemonListProps) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {isLoading
          ? Array.from({ length: perPage }).map((_, i) => (
              <PokemonCardSkeleton key={i} />
            ))
          : pokemon.map((pokemonItem) => (
              <PokemonCard
                key={pokemonItem.id}
                pokemon={pokemonItem}
                onClick={() => onSelect?.(pokemonItem)}
              />
            ))}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page > 0) goToPage(page - 1);
              }}
              aria-disabled={page === 0}
              className={page === 0 ? "pointer-events-none opacity-40" : ""}
            />
          </PaginationItem>

          {getPageNumbers(page, totalPages).map((p, i) =>
            p === "..." ? (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === page}
                  onClick={(e) => {
                    e.preventDefault();
                    goToPage(p);
                  }}
                >
                  {p + 1}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPages - 1) goToPage(page + 1);
              }}
              aria-disabled={page >= totalPages - 1}
              className={
                page >= totalPages - 1 ? "pointer-events-none opacity-40" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};
