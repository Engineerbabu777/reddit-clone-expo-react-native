import { atom } from "jotai";
import { Group } from "./app/(protected)/groupSelector";

export const selectedGroupAtom = atom<Group | null>(null);

// supabase gen types typescript --project-id efjuossspptyybqodhen > database.types.ts
