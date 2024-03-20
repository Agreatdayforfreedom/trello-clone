import { z } from "zod";

export const CreateCard = z.object({
	title: z
		.string({
			required_error: "Title is required",
			invalid_type_error: "Title is required",
		})
		.min(3, {
			message: "Title is too short",
		}),
	boardId: z.string(),
	listId: z.string(),
});

export const UpdateCard = z.object({
	title: z
		.string({
			required_error: "Title is required",
			invalid_type_error: "Title is required",
		})
		.min(3, {
			message: "Title is too short",
		}),
	description: z.optional(
		z
			.string({
				required_error: "Description is required",
				invalid_type_error: "Description is required",
			})
			.min(3, {
				message: "Description is too short",
			})
	),
	boardId: z.string(),
	id: z.string(),
});
