"use server";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

import { UpdateCardOrder, UpdateListOrder } from "./schema";
import { ReturnType } from "./types";
import { Card, List } from "@prisma/client";

const handler = async (data: any): Promise<ReturnType> => {
	const { userId, orgId } = auth();
	if (!userId || !orgId) {
		return {
			error: "Unauthorized",
		};
	}

	const { items, boardId } = data;

	let lists;

	try {
		const transaction = items.map((list: List) =>
			db.list.update({
				where: {
					id: list.id,
					board: {
						orgId,
					},
				},
				data: {
					order: list.order,
				},
			})
		);

		lists = await db.$transaction(transaction);
	} catch (error) {
		return {
			error: "Failed to reorder",
		};
	}

	revalidatePath(`/board/${boardId}`);
	return { data: lists };
};

const handlerCard = async (data: any): Promise<ReturnType> => {
	const { userId, orgId } = auth();
	if (!userId || !orgId) {
		return {
			error: "Unauthorized",
		};
	}

	const { items, boardId } = data;

	let updatedCards;

	try {
		const transaction = items.map((card: Card) =>
			db.card.update({
				where: {
					id: card.id,
					list: {
						board: {
							orgId,
						},
					},
				},
				data: {
					order: card.order,
					listId: card.listId,
				},
			})
		);

		updatedCards = await db.$transaction(transaction);
	} catch (error) {
		return {
			error: "Failed to reorder",
		};
	}

	revalidatePath(`/board/${boardId}`);
	return { data: updatedCards };
};

export const updateListOrder = createSafeAction(UpdateListOrder, handler);
export const updateCardOrder = createSafeAction(UpdateCardOrder, handlerCard);
