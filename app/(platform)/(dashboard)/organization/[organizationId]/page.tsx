import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { Board } from "./_components/board";
import { Form } from "./_components/form";
import { createBoard } from "@/actions/board";

const Page = async () => {
	const boards = await db.board.findMany();
	return (
		<div>
			<Form />
			<div className="flex space-y-2">
				{boards.map((board) => (
					<Board key={board.id} board={board} />
				))}
			</div>
		</div>
	);
};

export default Page;
