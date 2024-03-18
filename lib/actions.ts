"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

import { z } from "zod";

export type State = {
	errors: {
		title?: string[] | undefined;
	};
	message: string;
};

const CreateBoard = z.object({
	title: z.string().min(3, {
		message: "Minimun length of 3 letters is required",
	}),
});

export async function createBoard(prevState: any, formData: FormData) {
	const validatedFields = CreateBoard.safeParse({
		title: formData.get("title") as string,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "Missing fields",
		};
	}

	const { title } = validatedFields.data;

	try {
		await db.board.create({
			data: {
				title,
			},
		});
	} catch (error) {
		return {
			message: "Database error",
		};
	}
	revalidatePath("/organization/[id]", "page");
	// redirect("/organization/[id]",);
}

export async function deleteBoard(id: string) {
	await db.board.delete({
		where: {
			id,
		},
	});

	revalidatePath("/organization/[id]", "page");
}
