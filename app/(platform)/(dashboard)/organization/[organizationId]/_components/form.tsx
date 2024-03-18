"use client";
import React from "react";
import { State, createBoard } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { FormButton } from "./form-button";

export const Form = () => {
	const initialState = { message: null, errors: {} };
	const [state, dispatch] = useFormState<any, any>(createBoard, initialState);
	return (
		<form action={dispatch}>
			<div>
				<input
					id="title"
					name="title"
					required
					placeholder="Enter a board title"
					className="border-black border p-1"
				/>
				{state?.errors?.title ? (
					<div>
						{state.errors.title.map((error: string) => (
							<p key={error} className="text-rose-500">
								{error}
							</p>
						))}
					</div>
				) : null}
			</div>
			<FormButton />
		</form>
	);
};
