"use server";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/create-audit-log";

import { CopyCard, CreateCard, DeleteCard, UpdateCard } from "./schema";
import {
	CopyReturnType,
	DeleteReturnType,
	ReturnType,
	UpdateReturnType,
} from "./types";

const handler = async (data: any): Promise<ReturnType> => {
	const { userId, orgId } = auth();
	if (!userId || !orgId) {
		return {
			error: "Unauthorized",
		};
	}

	const { title, boardId, listId } = data;

	let card;

	try {
		const list = await db.list.findUnique({
			where: {
				id: listId,
				board: {
					orgId,
				},
			},
		});
		if (!list) {
			return {
				error: "List not found",
			};
		}

		const lastCard = await db.card.findFirst({
			where: { listId },
			orderBy: { order: "desc" },
			select: { order: true },
		});

		const newOrder = lastCard ? lastCard.order + 1 : 1;

		card = await db.card.create({
			data: {
				title,
				listId,
				order: newOrder,
			},
		});

		await createAuditLog({
			entityId: card.id,
			entityTitle: card.title,
			entityType: ENTITY_TYPE.CARD,
			action: ACTION.CREATE,
		});
	} catch (error) {
		return {
			error: "Failed to update",
		};
	}

	revalidatePath(`/board/${boardId}`);
	return { data: card };
};

const updateHandler = async (data: any): Promise<UpdateReturnType> => {
	const { userId, orgId } = auth();
	if (!userId || !orgId) {
		return {
			error: "Unauthorized",
		};
	}

	const { id, boardId, ...values } = data;

	let card;

	try {
		card = await db.card.update({
			where: {
				id,
				list: {
					board: {
						orgId,
					},
				},
			},
			data: {
				...values,
			},
		});
		await createAuditLog({
			entityId: card.id,
			entityTitle: card.title,
			entityType: ENTITY_TYPE.CARD,
			action: ACTION.UPDATE,
		});
	} catch (error) {
		return {
			error: "Failed to update",
		};
	}

	revalidatePath(`/board/${boardId}`);
	return { data: card };
};

const copyHandler = async (data: any): Promise<CopyReturnType> => {
	const { userId, orgId } = auth();
	if (!userId || !orgId) {
		return {
			error: "Unauthorized",
		};
	}

	const { id, boardId, ...values } = data;

	let card;

	try {
		const cardToCopy = await db.card.findUnique({
			where: {
				id,
				list: {
					board: {
						orgId,
					},
				},
			},
		});
		if (!cardToCopy) {
			return { error: "Card not found" };
		}

		const lastCard = await db.card.findFirst({
			where: { listId: cardToCopy.listId },
			orderBy: { order: "desc" },
			select: { order: true },
		});

		const newOrder = lastCard ? lastCard.order + 1 : 1;

		card = await db.card.create({
			data: {
				title: `${cardToCopy.title} - Copy`,
				description: cardToCopy.description,
				order: newOrder,
				listId: cardToCopy.listId,
			},
		});

		await createAuditLog({
			entityId: card.id,
			entityTitle: card.title,
			entityType: ENTITY_TYPE.CARD,
			action: ACTION.CREATE,
		});
	} catch (error) {
		return {
			error: "Failed to copy",
		};
	}

	revalidatePath(`/board/${boardId}`);
	return { data: card };
};

const deleteHandler = async (data: any): Promise<DeleteReturnType> => {
	const { userId, orgId } = auth();
	if (!userId || !orgId) {
		return {
			error: "Unauthorized",
		};
	}

	const { id, boardId, ...values } = data;

	let card;

	try {
		card = await db.card.delete({
			where: {
				id,
				list: {
					board: {
						orgId,
					},
				},
			},
		});
		await createAuditLog({
			entityId: card.id,
			entityTitle: card.title,
			entityType: ENTITY_TYPE.CARD,
			action: ACTION.DELETE,
		});
	} catch (error) {
		return {
			error: "Failed to delete",
		};
	}

	revalidatePath(`/board/${boardId}`);
	return { data: card };
};

export const createCard = createSafeAction(CreateCard, handler);
export const updateCard = createSafeAction(UpdateCard, updateHandler);
export const copyCard = createSafeAction(CopyCard, copyHandler);
export const deleteCard = createSafeAction(DeleteCard, deleteHandler);
