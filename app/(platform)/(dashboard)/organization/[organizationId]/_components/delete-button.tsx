"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export const DeleteButton = () => {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" disabled={pending} size="sm" variant="destructive">
			Delete
		</Button>
	);
};
