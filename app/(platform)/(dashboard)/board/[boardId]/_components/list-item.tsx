"use client";

import { ListWithCards } from "@/types";
import { ListHeader } from "./list-header";
import { ElementRef, useRef, useState } from "react";

interface Props {
	index: number;
	data: ListWithCards;
}

export const ListItem = ({ index, data }: Props) => {
	const [isEditing, setIsEditing] = useState(false);

	const formRef = useRef<ElementRef<"form">>(null);
	const textareaRef = useRef<ElementRef<"input">>(null);

	const enableEditing = () => {
		setIsEditing(true);
		setTimeout(() => {
			textareaRef.current?.focus();
		});
	};

	const disableEditing = () => {
		setIsEditing(false);
	};

	return (
		<li className="shrink-0 h-full w-[272px] select-none">
			<div className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
				<ListHeader data={data} />
			</div>
		</li>
	);
};
