"use client";

import { Search } from "lucide-react";
import { useDeferredValue, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/foundation/input";

type SearchBarProps = {
  placeholder?: string;
};

export function SearchBar({ placeholder = "Search people" }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") ?? "");
  const deferredValue = useDeferredValue(value);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (deferredValue) {
      params.set("search", deferredValue);
    } else {
      params.delete("search");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, [deferredValue, pathname, router, searchParams]);

  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="pl-9"
        placeholder={placeholder}
      />
    </label>
  );
}
