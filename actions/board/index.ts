"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import {
	InputType,
	ReturnType,
	UpdateInputType,
	UpdateReturnType,
} from "./types";
import { CreateBoard, DeleteBoard, UpdateBoard } from "./schema";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/create-audit-log";
import {
	decreaseAvailableCount,
	hasAvailableCount,
	incrementAvailableCount,
} from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

const handler = async (data: any): Promise<ReturnType> => {
	const { userId, orgId } = auth();

	if (!userId || !orgId) {
		return {
			error: "Unauthorized",
		};
	}

	const canCreate = await hasAvailableCount();
	const isPro = await checkSubscription();
	if (!canCreate && !isPro) {
		return {
			error:
				"You have reached your limit of free boards. Please upgrade to create more.",
		};
	}

	const { title, image } = data;

	const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
		image.split("|");

	if (
		!imageId ||
		!imageThumbUrl ||
		!imageFullUrl ||
		!imageLinkHTML ||
		!imageUserName
	) {
		return {
			error: "Missing fields.",
		};
	}

	let board;

	try {
		board = await db.board.create({
			data: {
				title,
				orgId,
				imageId,
				imageThumbUrl,
				imageFullUrl,
				imageLinkHTML,
				imageUserName,
			},
		});
		if (!isPro) {
			await incrementAvailableCount();
		}
		await createAuditLog({
			entityId: board.id,
			entityTitle: board.title,
			entityType: ENTITY_TYPE.BOARD,
			action: ACTION.CREATE,
		});
	} catch (error) {
		return {
			error: "Failed to create.",
		};
	}

	revalidatePath(`/organization/${board.id}`);
	return { data: board };
};

export async function deleteHandler(data: any) {
	const { userId, orgId } = auth();
	const isPro = checkSubscription();

	if (!userId || !orgId) {
		return {
			error: "Unauthorized",
		};
	}

	const { id } = data;

	let board;

	try {
		board = await db.board.delete({
			where: {
				id,
				orgId,
			},
		});
		if (!isPro) {
			await decreaseAvailableCount();
		}
		await createAuditLog({
			entityId: board.id,
			entityTitle: board.title,
			entityType: ENTITY_TYPE.BOARD,
			action: ACTION.DELETE,
		});
	} catch (error) {}
	revalidatePath(`/organization/${orgId}`);
	redirect(`/organization/${orgId}`);
}

const updateHandler = async (data: any): Promise<UpdateReturnType> => {
	const { userId, orgId } = auth();
	if (!userId || !orgId) {
		return {
			error: "Unauthorized",
		};
	}

	const { title, id } = data;

	let board;

	try {
		board = await db.board.update({
			where: {
				id,
				orgId,
			},
			data: {
				title,
			},
		});

		await createAuditLog({
			entityId: board.id,
			entityTitle: board.title,
			entityType: ENTITY_TYPE.BOARD,
			action: ACTION.UPDATE,
		});
	} catch (error) {
		return {
			error: "Failed to update",
		};
	}

	revalidatePath(`/board/${id}`);
	return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);
export const updateBoard = createSafeAction(UpdateBoard, updateHandler);
export const deleteBoard = createSafeAction(DeleteBoard, deleteHandler);
