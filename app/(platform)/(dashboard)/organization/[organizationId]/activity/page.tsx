import { Suspense } from "react";

import { Separator } from "@/components/ui/separator";

import { Info } from "../_components/info";

import { ActivityList } from "./_components/activity-list";
import { checkSubscription } from "@/lib/subscription";

const ActivityPage = async () => {
	const isProp = await checkSubscription();
	return (
		<div className="w-full">
			<Info isPro={isProp} />
			<Separator className="my-2" />
			<Suspense fallback={<ActivityList.Skeleton />}>
				<ActivityList />
			</Suspense>
		</div>
	);
};

export default ActivityPage;
