import { atom } from "jotai";
import { Group } from "../types";

export const selectedGroupAtom = atom<Group | null>(null);



// supabase gen types typescript --project-id efjuossspptyybqodhen > database.types.ts