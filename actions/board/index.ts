"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import {
	InputType,
	ReturnType,
	UpdateInputType,
	UpdateReturnType,
} from "./types";
import { CreateBoard, DeleteBoard, UpdateBoard } from "./schema";
import { redirect } from "next/navigation";

const handler = async (data: any): Promise<ReturnType> => {
	const { userId, orgId } = auth();

	if (!userId || !orgId) {
		return {
			error: "Unauthorized",
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
	console.log({
		imageId,
		imageThumbUrl,
		imageFullUrl,
		imageLinkHTML,
		imageUserName,
	});
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
	if (!userId || !orgId) {
		return {
			error: "Unauthorized",
		};
	}

	const { id } = data;

	let board;

	try {
		await db.board.delete({
			where: {
				id,
				orgId,
			},
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
