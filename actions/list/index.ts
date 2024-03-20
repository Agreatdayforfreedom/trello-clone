"use server";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

import { CopyList, CreateList, DeleteList, UpdateList } from "./schema";
import { ReturnType, UpdateReturnType } from "./types";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data: any): Promise<ReturnType> => {
	const { userId, orgId } = auth();
	if (!userId || !orgId) {
		return {
			error: "Unauthorized",
		};
	}

	const { title, boardId } = data;

	let list;

	try {
		const board = await db.board.findUnique({
			where: {
				id: boardId,
				orgId,
			},
		});

		if (!board) {
			return {
				error: "Board not found",
			};
		}

		const lastList = await db.list.findFirst({
			where: { boardId },
			orderBy: { order: "desc" },
			select: { order: true },
		});

		const newOrder = lastList ? lastList.order + 1 : 1;
		list = await db.list.create({
			data: {
				title,
				boardId,
				order: newOrder,
			},
		});

		await createAuditLog({
			entityId: list.id,
			entityTitle: list.title,
			entityType: ENTITY_TYPE.LIST,
			action: ACTION.CREATE,
		});
	} catch (error) {
		return {
			error: "Failed to update",
		};
	}

	revalidatePath(`/board/${boardId}`);
	return { data: list };
};

const updateHandler = async (data: any): Promise<UpdateReturnType> => {
	const { userId, orgId } = auth();
	if (!userId || !orgId) {
		return {
			error: "Unauthorized",
		};
	}

	const { title, boardId, id } = data;

	let list;

	try {
		const board = await db.board.findUnique({
			where: {
				id: boardId,
				orgId,
			},
		});

		if (!board) {
			return {
				error: "Board not found",
			};
		}

		list = await db.list.update({
			where: {
				id,
				boardId,
				board: {
					orgId,
				},
			},
			data: {
				title,
			},
		});

		await createAuditLog({
			entityId: list.id,
			entityTitle: list.title,
			entityType: ENTITY_TYPE.LIST,
			action: ACTION.UPDATE,
		});
	} catch (error) {
		return {
			error: "Failed to update",
		};
	}

	revalidatePath(`/board/${boardId}`);
	return { data: list };
};

export async function deleteHandler(data: any) {
	const { userId, orgId } = auth();
	if (!userId || !orgId) {
		return {
			error: "Unauthorized",
		};
	}

	const { id, boardId } = data;

	let list;

	try {
		list = await db.list.delete({
			where: {
				id,
				boardId,
				board: {
					orgId,
				},
			},
		});
		await createAuditLog({
			entityId: list.id,
			entityTitle: list.title,
			entityType: ENTITY_TYPE.LIST,
			action: ACTION.DELETE,
		});
	} catch (error) {}
	revalidatePath(`/board/${orgId}`);
	return { data: list };
}

export async function copyHandler(data: any) {
	const { userId, orgId } = auth();
	if (!userId || !orgId) {
		return {
			error: "Unauthorized",
		};
	}

	const { id, boardId } = data;

	let list;

	try {
		const listToCopy = await db.list.findUnique({
			include: {
				cards: true,
			},
			where: {
				id,
				boardId,
				board: {
					orgId,
				},
			},
		});

		if (!listToCopy) {
			return { error: "List not found" };
		}

		const lastList = await db.list.findFirst({
			where: { boardId },
			orderBy: { order: "desc" },
			select: { order: true },
		});
		const newOrder = lastList ? lastList.order + 1 : 1;
		list = await db.list.create({
			data: {
				boardId: listToCopy.boardId,
				title: `${listToCopy.title} - Copy`,
				order: newOrder,
				cards: {
					createMany: {
						data: listToCopy.cards.map((card) => ({
							title: card.title,
							description: card.description,
							order: card.order,
						})),
					},
				},
			},
			include: {
				cards: true,
			},
		});

		await createAuditLog({
			entityId: list.id,
			entityTitle: list.title,
			entityType: ENTITY_TYPE.LIST,
			action: ACTION.CREATE,
		});
	} catch (error) {
		return {
			error: "Failed to copy",
		};
	}
	revalidatePath(`/board/${orgId}`);
	return { data: list };
}

export const createList = createSafeAction(CreateList, handler);
export const deleteList = createSafeAction(DeleteList, deleteHandler);
export const updateList = createSafeAction(UpdateList, updateHandler);
export const copyList = createSafeAction(CopyList, copyHandler);
