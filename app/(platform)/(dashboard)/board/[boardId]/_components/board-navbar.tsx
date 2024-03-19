import React from "react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Board } from "@prisma/client";
import { BoardTitleForm } from "./board-title-form";
import { BoardOptions } from "./board-options";

interface Props {
	data: Board;
}

export const BoardNavbar = async ({ data }: Props) => {
	const { orgId } = auth();

	return (
		<div className="w-full h-14 z-40 bg-black/40 fixed top-14 flex items-center px-6 gap-x-4 text-white">
			<BoardTitleForm data={data} />
			<div className="ml-auto">
				<BoardOptions id={data.id} />
			</div>
		</div>
	);
};
