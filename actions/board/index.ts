"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { CreateBoard } from "./schema";

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

export async function deleteBoard(id: string) {
	await db.board.delete({
		where: {
			id,
		},
	});

	revalidatePath("/organization/[id]", "page");
}

export const createBoard = createSafeAction(CreateBoard, handler);
