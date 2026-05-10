import { supabase } from "../lib/supabase/supabaseClient";

interface UpdateWorkoutTemplateProps {
	id: string;
	name: string;
	description?: string;
	color?: string;
	is_active: boolean;
	days_per_week?: number;
}

export default async function updateWorkoutTemplate(
	formData: UpdateWorkoutTemplateProps,
) {
	if (!formData.id) {
		throw new Error("updateWorkoutTemplate: missing id");
	}

	const updates: Record<string, unknown> = {
		name: formData.name,
		is_active: formData.is_active,
	};

	if (typeof formData.description === "string") {
		updates.description = formData.description;
	}

	if (typeof formData.color === "string") {
		updates.color = formData.color;
	}

	if (
		typeof formData.days_per_week === "number" &&
		Number.isFinite(formData.days_per_week) &&
		formData.days_per_week >= 1 &&
		formData.days_per_week <= 7
	) {
		updates.days_per_week = formData.days_per_week;
	}

	const { data } = await supabase
		.from("workout_templates")
		.update(updates)
		.eq("id", formData.id)
		.select("*")
		.maybeSingle()
		.throwOnError();

	return data;
}
