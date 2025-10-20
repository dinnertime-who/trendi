"use client";
import { useQueryState } from "nuqs";
import { defaultStringParser } from "@/lib/nuqs/parser";

export const useSearchByQ = () => {
  const [q, setQ] = useQueryState("q", defaultStringParser());
  return { q, setQ };
};
