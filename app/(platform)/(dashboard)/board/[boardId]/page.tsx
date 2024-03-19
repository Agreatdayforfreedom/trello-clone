import React from "react";
import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

import { ListContainer } from "./_components/list-container";

interface Props {
	params: {
		boardId: string;
	};
}

const Page = async ({ params }: Props) => {
	const { orgId } = auth();

	if (!orgId) {
		redirect("/select-org");
	}

	const lists = await db.list.findMany({
		where: {
			boardId: params.boardId,
			board: {
				orgId,
			},
		},
		include: {
			cards: {
				orderBy: {
					order: "asc",
				},
			},
		},
		orderBy: {
			order: "asc",
		},
	});

	return (
		<div className="p-4 h-fukk overflow-x-auto">
			<ListContainer boardId={params.boardId} data={lists} />
		</div>
	);
};

export default Page;
