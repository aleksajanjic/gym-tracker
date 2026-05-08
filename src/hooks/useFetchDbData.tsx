import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase/supabaseClient";

export function useWorkoutTemplates() {
	return useQuery({
		queryKey: ["workout_templates"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("workout_templates")
				.select("*");

			if (error) throw error;
			return data;
		},
		staleTime: 1000 * 60 * 5,
	});
}
