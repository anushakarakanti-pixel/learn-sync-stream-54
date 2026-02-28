import { supabase } from "@/integrations/supabase/client";

export const saveProgress = async (
  userId: string,
  videoId: string,
  lastWatched: number,
  completed: boolean = false
) => {
  const { error } = await supabase
    .from("user_progress")
    .upsert(
      {
        user_id: userId,
        video_id: videoId,
        last_watched: lastWatched,
        completed,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,video_id" }
    );
  if (error) console.error("Error saving progress:", error);
};

export const getProgress = async (userId: string, videoId: string) => {
  const { data, error } = await supabase
    .from("user_progress")
    .select("last_watched, completed")
    .eq("user_id", userId)
    .eq("video_id", videoId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching progress:", error);
    return null;
  }
  return data;
};

export const getAllProgress = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_progress")
    .select("video_id, last_watched, completed")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching all progress:", error);
    return [];
  }
  return data ?? [];
};
