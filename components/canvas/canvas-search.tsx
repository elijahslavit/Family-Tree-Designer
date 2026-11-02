"use client";

import { Search, X } from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";

export type CanvasSearchPerson = { id: string; name: string; years: string };

const MAX_RESULTS = 8;

function normalise(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/** Ranks whole-word prefix matches ahead of matches inside a word. */
export function searchPeople(people: CanvasSearchPerson[], query: string) {
  const needle = normalise(query);
  if (!needle) return [];
  return people
    .map((person) => {
      const name = normalise(person.name);
      const index = name.indexOf(needle);
      if (index < 0) return null;
      const wordStart = index === 0 || name[index - 1] === " ";
      return { person, score: (wordStart ? 0 : 100) + index };
    })
    .filter((match): match is { person: CanvasSearchPerson; score: number } => Boolean(match))
    .sort((left, right) => left.score - right.score || left.person.name.localeCompare(right.person.name))
    .slice(0, MAX_RESULTS)
    .map((match) => match.person);
}

/** Accessible combobox for jumping the family tree to anyone in the presentation. */
export function CanvasSearch({
  people,
  onSelect,
}: {
  people: CanvasSearchPerson[];
  onSelect: (personId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const results = useMemo(() => searchPeople(people, query), [people, query]);
  const expanded = open && query.trim().length > 0;

  function choose(person: CanvasSearchPerson) {
    setQuery("");
    setOpen(false);
    setActiveIndex(0);
    onSelect(person.id);
  }

  return (
    <div className="relative w-full sm:max-w-xs">
      <label htmlFor={`${listId}-input`} className="sr-only">
        Find a person in the family tree
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--creator-text-muted)]"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        id={`${listId}-input`}
        type="text"
        role="combobox"
        autoComplete="off"
        spellCheck={false}
        aria-expanded={expanded}
        aria-controls={`${listId}-listbox`}
        aria-autocomplete="list"
        aria-activedescendant={expanded && results[activeIndex] ? `${listId}-option-${activeIndex}` : undefined}
        placeholder="Find a person…"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
          setActiveIndex(0);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && results.length) {
            event.preventDefault();
            setOpen(true);
            setActiveIndex((index) => (index + 1) % results.length);
          } else if (event.key === "ArrowUp" && results.length) {
            event.preventDefault();
            setActiveIndex((index) => (index - 1 + results.length) % results.length);
          } else if (event.key === "Enter" && expanded && results[activeIndex]) {
            event.preventDefault();
            choose(results[activeIndex]);
          } else if (event.key === "Escape") {
            if (query) {
              event.preventDefault();
              setQuery("");
            }
            setOpen(false);
          }
        }}
        className="h-10 w-full rounded-full border border-[var(--creator-border)] bg-[var(--creator-surface-muted)] pl-9 pr-9 text-sm text-[var(--creator-text)] placeholder:text-[var(--creator-text-muted)] focus:border-[var(--creator-border-strong)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_oklab,var(--accent-primary)_25%,transparent)]"
      />
      {query ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            setQuery("");
            inputRef.current?.focus();
          }}
          className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-[var(--creator-text-muted)] hover:bg-[var(--creator-surface)] hover:text-[var(--creator-text)]"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      ) : null}

      {expanded ? (
        <ul
          id={`${listId}-listbox`}
          role="listbox"
          aria-label="Matching people"
          className="absolute inset-x-0 top-[calc(100%+0.4rem)] z-30 max-h-80 overflow-y-auto rounded-2xl border border-[var(--creator-border)] bg-[var(--creator-surface)] p-1.5 shadow-[var(--shadow-lg)]"
        >
          {results.length ? (
            results.map((person, index) => (
              <li
                key={person.id}
                id={`${listId}-option-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(person)}
                className={`flex cursor-pointer items-baseline justify-between gap-3 rounded-xl px-3 py-2 text-sm ${
                  index === activeIndex
                    ? "bg-[var(--creator-surface-muted)] text-[var(--creator-text)]"
                    : "text-[var(--creator-text)]"
                }`}
              >
                <span className="truncate font-medium">{person.name}</span>
                <span className="shrink-0 text-xs tabular-nums text-[var(--creator-text-muted)]">{person.years}</span>
              </li>
            ))
          ) : (
            <li role="option" aria-selected={false} aria-disabled="true" className="px-3 py-2 text-sm text-[var(--creator-text-muted)]">
              No one in this presentation matches “{query.trim()}”.
            </li>
          )}
        </ul>
      ) : null}
    </div>
  );
}
