import { useEffect, useState } from "react";
import type { GeneratorInput } from "./types";

// Lightweight global store so BobChat can read the latest generator inputs
// without prop drilling. Updated whenever the user runs the generator.
let current: GeneratorInput | null = null;
const listeners = new Set<(v: GeneratorInput | null) => void>();

export const setLatestGeneratorInput = (input: GeneratorInput) => {
  current = input;
  listeners.forEach((l) => l(current));
};

export const getLatestGeneratorInput = (): GeneratorInput | null => current;

export const useLatestGeneratorInput = () => {
  const [value, setValue] = useState<GeneratorInput | null>(current);
  useEffect(() => {
    listeners.add(setValue);
    return () => {
      listeners.delete(setValue);
    };
  }, []);
  return value;
};
