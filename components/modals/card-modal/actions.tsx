import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CardWithList } from "@/types";
import { Button } from "../../ui/button";
import { Copy, Trash } from "lucide-react";
import { useAction } from "../../../hooks/use-action";
import { copyCard, deleteCard } from "../../../actions/card";
import { useParams } from "next/navigation";
import { useCardModal } from "../../../hooks/use-card-modal";
import { toast } from "sonner";

interface Props {
	data: CardWithList;
}

export const Actions = ({ data }: Props) => {
	const params = useParams();
	const cardModal = useCardModal();
	const { execute: executeCopy, isLoading: isLoadingCopy } = useAction(
		copyCard,
		{
			onSuccess(data) {
				toast.success(`Card "${data.title}" copied`);
				cardModal.onClose();
			},
			onError(error) {
				toast.error(error);
			},
		}
	);
	const { execute: executeDelete, isLoading: isLoadingDelete } = useAction(
		deleteCard,
		{
			onSuccess(data) {
				toast.success(`Card "${data.title}" deleted`);
				cardModal.onClose();
			},
			onError(error) {
				toast.error(error);
			},
		}
	);

	const onCopy = () => {
		const boardId = params.boardId as string;

		executeCopy({
			id: data.id,
			boardId,
		});
	};

	const onDelete = () => {
		const boardId = params.boardId as string;

		executeDelete({
			id: data.id,
			boardId,
		});
	};

	return (
		<div className="space-y-2 mt-2">
			<p className="tex-xs font-semibold">Actions</p>
			<Button
				onClick={onCopy}
				disabled={isLoadingCopy}
				variant="gray"
				size="inline"
				className="w-full justify-start"
			>
				<Copy className="h-4 w-4 mr-2" />
				Copy
			</Button>
			<Button
				onClick={onDelete}
				disabled={isLoadingDelete}
				variant="gray"
				size="inline"
				className="w-full justify-start"
			>
				<Trash className="h-4 w-4 mr-2" />
				Delete
			</Button>
		</div>
	);
};

Actions.Skeleton = function ActionSkeleton() {
	return (
		<div className="space-y-2 my-2">
			<Skeleton className="w-20 h-4 bg-neutral-200" />
			<Skeleton className="w-full h-8 bg-neutral-200" />
			<Skeleton className="w-full h-8 bg-neutral-200" />
		</div>
	);
};
