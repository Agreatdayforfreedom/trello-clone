import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { useQuery } from "@tanstack/react-query";
import { CardWithList } from "@/types";
import { fetcher } from "@/lib/fetcher";
import { Header } from "./header";

export const CardModal = () => {
	const { id, isOpen, onClose } = useCardModal((state) => state);

	const { data: cardData } = useQuery<CardWithList>({
		queryKey: ["card", id],
		queryFn: () => fetcher(`/api/cards/${id}`),
	});

	return (
		<div>
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent>
					{!cardData ? <Header.Skeleton /> : <Header data={cardData} />}
				</DialogContent>
			</Dialog>
		</div>
	);
};
