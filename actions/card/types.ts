import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";
import { Card } from "@prisma/client";
import { CreateCard, UpdateCard } from "./schema";

export type InputType = z.infer<typeof CreateCard>;
export type ReturnType = ActionState<InputEvent, Card>;

export type UpdateInputType = z.infer<typeof UpdateCard>;
export type UpdateReturnType = ActionState<UpdateInputType, Card>;

// export type DeleteInputType = z.infer<typeof DeleteList>;
// export type DeleteReturnType = ActionState<InputEvent, List>;
