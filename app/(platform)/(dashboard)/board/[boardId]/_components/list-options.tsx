"use client";

import { List } from "@prisma/client";
import React, { ElementRef, useRef } from "react";
import { MoreHorizontal, X } from "lucide-react";

import {
	Popover,
	PopoverClose,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FormSubmit } from "@/components/form/form-submit";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/use-action";
import { copyList, deleteList } from "@/actions/list";
import { toast } from "sonner";
interface Props {
	data: List;
	onAddCard: () => void;
}

export const ListOptions = ({ data, onAddCard }: Props) => {
	const closeRef = useRef<ElementRef<"button">>(null);

	const { execute: executeDelete } = useAction(deleteList, {
		onSuccess: (data) => {
			toast.success(`List "${data.title}" deleted`);
			closeRef.current?.click();
		},
		onError: (error) => {
			toast.error(error);
		},
	});

	const onDelete = (formData: FormData) => {
		const id = formData.get("id") as string;
		const boardId = formData.get("boardId") as string;

		executeDelete({ id, boardId });
	};

	const { execute: executeCopy } = useAction(copyList, {
		onSuccess: (data) => {
			toast.success(`List "${data.title}" copied`);
			closeRef.current?.click();
		},
		onError: (error) => {
			toast.error(error);
		},
	});

	const onCopy = (formData: FormData) => {
		const id = formData.get("id") as string;
		const boardId = formData.get("boardId") as string;

		executeCopy({ id, boardId });
	};
	return (
		<div>
			<Popover>
				<PopoverTrigger asChild>
					<Button className="h-auto w-auto p-2" variant="ghost">
						<MoreHorizontal />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="px-0 py-3" side="bottom" align="start">
					<div className="text-sm font-medium text-center text-neutral-600 pb-4"></div>
					<PopoverClose ref={closeRef} asChild>
						<Button
							className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
							variant="ghost"
						>
							<X className="h-4 w-4" />
						</Button>
					</PopoverClose>
					<Button
						onClick={onAddCard}
						className=" rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
						variant="ghost"
					>
						Add card...
					</Button>
					<form action={onCopy}>
						<input type="hidden" id="id" name="id" value={data.id} />
						<input
							type="hidden"
							id="boardId"
							name="boardId"
							value={data.boardId}
						/>
						<FormSubmit
							className=" rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
							variant="ghost"
						>
							Copy list...
						</FormSubmit>
					</form>
					<Separator />
					<form action={onDelete}>
						<input type="hidden" id="id" name="id" value={data.id} />
						<input
							type="hidden"
							id="boardId"
							name="boardId"
							value={data.boardId}
						/>
						<FormSubmit
							className="  rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
							variant="ghost"
						>
							Delete this list...
						</FormSubmit>
					</form>
				</PopoverContent>
			</Popover>
		</div>
	);
};
