import { supabase } from "../lib/supabase/supabaseClient";

export default async function deleteWorkoutTemplate(id: string) {
	const { data, error } = await supabase
		.from("workout_templates")
		.delete()
		.eq("id", id)
		.select();

	if (error) {
		console.log(error);
		throw error;
	}

	return data;
}
