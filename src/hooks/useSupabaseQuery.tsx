import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase/supabaseClient";

type FilterOperator = "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "like";

interface Filter {
	column: string;
	value: unknown;
	operator?: FilterOperator;
}

interface UseSupabaseQueryProps {
	table: string;
	select?: string;
	filters?: Filter[];
}

export function useSupabaseQuery<T>({
	table,
	select = "*",
	filters = [],
}: UseSupabaseQueryProps) {
	const [data, setData] = useState<T[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let ignore = false;

		async function fetchData() {
			try {
				setLoading(true);
				setError(null);

				let query = supabase.from(table).select(select);

				for (const filter of filters) {
					switch (filter.operator) {
						case "neq":
							query = query.neq(filter.column, filter.value);
							break;

						default:
							query = query.eq(filter.column, filter.value);
					}
				}

				const { data, error } = await query;

				if (ignore) return;

				if (error) {
					setError(error.message);
					setData([]);
				} else {
					setData(data as T[]);
				}
			} catch (err) {
				console.error(err);

				setError("Something went wrong");
			} finally {
				setLoading(false);
			}
		}

		fetchData();

		return () => {
			ignore = true;
		};
	}, [table, select, JSON.stringify(filters)]);

	return {
		data,
		loading,
		error,
	};
}
