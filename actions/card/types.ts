import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";
import { Card } from "@prisma/client";
import { CopyCard, CreateCard, DeleteCard, UpdateCard } from "./schema";

export type InputType = z.infer<typeof CreateCard>;
export type ReturnType = ActionState<InputEvent, Card>;

export type UpdateInputType = z.infer<typeof UpdateCard>;
export type UpdateReturnType = ActionState<UpdateInputType, Card>;

export type CopyInputType = z.infer<typeof CopyCard>;
export type CopyReturnType = ActionState<CopyInputType, Card>;

export type DeleteInputType = z.infer<typeof DeleteCard>;
export type DeleteReturnType = ActionState<DeleteInputType, Card>;
