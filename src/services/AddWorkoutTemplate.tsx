import { supabase } from "../lib/supabase/supabaseClient";

type WorkoutTemplateInput = {
	name: string;
	description: string;
	color: string;
	active: boolean;
	days_per_week: number;
};

export default async function addWorkoutTemplates(
	formData: WorkoutTemplateInput,
) {
	const { data, error } = await supabase
		.from("workout_templates")
		.insert([
			{
				name: formData.name,
				description: formData.description,
				color: formData.color,
				is_active: formData.active,
				days_per_week: formData.days_per_week
					? formData.days_per_week
					: 4,
			},
		])
		.select()
		.single();

	if (error) {
		console.log(error);
		return null;
	}

	return data;
}
