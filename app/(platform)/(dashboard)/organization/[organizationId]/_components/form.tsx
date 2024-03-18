"use client";
import React from "react";
import { createBoard } from "@/actions/board";
import { useAction } from "@/hooks/use-action";
import { FormInput } from "@/components/form/form-input";
import { FormSubmit } from "@/components/form/form-submit";

export const Form = () => {
	const { execute, fieldsErrors } = useAction(createBoard);

	const onSubmit = (formData: FormData) => {
		const title = formData.get("title") as string;
		execute({ title });
	};
	console.log(fieldsErrors);

	return (
		<form action={onSubmit}>
			<div>
				<FormInput id="title" label="Board title" errors={fieldsErrors} />
			</div>
			<FormSubmit>Save</FormSubmit>
		</form>
	);
};
