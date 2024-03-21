"use client";
import { SignIn, useSignIn } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
export default function Page() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { isLoaded, signIn, setActive } = useSignIn();

	const handleSubmit = async () => {
		if (!isLoaded) {
			return;
		}
		try {
			console.log("HERE");

			const completeSignIn = await signIn.create({
				identifier: process.env.NEXT_PUBLIC_TEST_USERNAME! as string,
				password: process.env.NEXT_PUBLIC_TEST_PASSWORD! as string,
			});

			if (completeSignIn.status !== "complete") {
				console.log(JSON.stringify(completeSignIn, null, 2));
			}

			if (completeSignIn.status === "complete") {
				await setActive({ session: completeSignIn.createdSessionId });
				router.push("/");
			}
		} catch (err: any) {
			console.error(JSON.stringify(err, null, 2));
		}
	};
	useEffect(() => {
		async function go() {
			if (searchParams.get("mode") === "test") {
				await handleSubmit();
			}
		}
		go();
	}, [searchParams, isLoaded]);

	return <SignIn />;
}
