import { z } from "zod";

export const CreateList = z.object({
	title: z
		.string({
			required_error: "Title is required",
			invalid_type_error: "Title is required",
		})
		.min(3, {
			message: "Title is too short",
		}),
	boardId: z.string(),
});

export const UpdateList = z.object({
	title: z
		.string({
			required_error: "Title is required",
			invalid_type_error: "Title is required",
		})
		.min(3, {
			message: "Title is too short",
		}),
	id: z.string(),
	boardId: z.string(),
});

export const DeleteList = z.object({
	id: z.string(),
	boardId: z.string(),
});

export const CopyList = z.object({
	id: z.string(),
	boardId: z.string(),
});
