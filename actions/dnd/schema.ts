import { z } from "zod";
export const UpdateListOrder = z.object({
	items: z.array(
		z.object({
			id: z.string(),
			title: z.string(),
			order: z.number(),
			createdAt: z.date(),
			updatedAt: z.date(),
		})
	),
	boardId: z.string(),
});

export const UpdateCardOrder = z.object({
	items: z.array(
		z.object({
			id: z.string(),
			title: z.string(),
			order: z.number(),
			listId: z.string(),

			createdAt: z.date(),
			updatedAt: z.date(),
		})
	),
	boardId: z.string(),
});
