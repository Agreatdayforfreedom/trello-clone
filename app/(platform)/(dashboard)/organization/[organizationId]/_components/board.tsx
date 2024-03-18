import React from "react";
import { deleteBoard } from "@/actions/board";
import { DeleteButton } from "./delete-button";

export const Board = ({ board }: any) => {
	const deleteWithId = deleteBoard.bind(null, board.id);

	return (
		<form action={deleteWithId}>
			<p>{board.title}</p>
			<DeleteButton />
		</form>
	);
};
