import { z } from "zod";

export const CreateBoard = z.object({
	title: z
		.string({
			required_error: "Title is required",
			invalid_type_error: "Title is required",
		})
		.min(3, {
			message: "Title is too short",
		}),
	image: z.string({
		required_error: "Image is required",
		invalid_type_error: "Image is required",
	}),
});

export const UpdateBoard = z.object({
	title: z
		.string({
			required_error: "Title is required",
			invalid_type_error: "Title is required",
		})
		.min(3, {
			message: "Title is too short",
		}),
	id: z.string(),
});

export const DeleteBoard = z.object({
	id: z.string(),
});
