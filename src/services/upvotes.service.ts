import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";

export const createUpvotes = async (
  post_id: string,
  value: 1 | -1,
  supabase: SupabaseClient<Database>
) => {
  const { data, error } = await supabase.from("upvotes").insert({
    post_id,
    value,
  });

  if (error) {
    throw error;
  } else {
    return data;
  }
};
