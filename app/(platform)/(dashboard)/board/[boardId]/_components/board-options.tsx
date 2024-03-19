"use client";
import React from "react";
import {
	Popover,
	PopoverClose,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Ghost, MoreHorizontal, X } from "lucide-react";
import { useAction } from "../../../../../../hooks/use-action";
import { deleteBoard } from "../../../../../../actions/board";
import { toast } from "sonner";

interface Props {
	id: string;
}

export const BoardOptions = ({ id }: Props) => {
	const { execute, isLoading } = useAction(deleteBoard, {
		onError: (error) => {
			toast.error(error);
		},
	});

	const onDelete = () => {
		execute({ id });
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button className="h-auto w-auto p-2" variant="transparent">
					<MoreHorizontal className="w-4 h-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
				<div className="text-sm font-medium text-center text-neutral text-neutral-600 pb-4">
					Board actions
				</div>
				<PopoverClose>
					<Button className="h-auto w-auto  p-2 absolute top-2 right-2 text-neutral-600">
						<X className="w-4 h-4" />
					</Button>
				</PopoverClose>
				<Button
					variant="ghost"
					onClick={onDelete}
					disabled={isLoading}
					className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal  text-sm"
				>
					Delete this board
				</Button>
			</PopoverContent>
		</Popover>
	);
};
