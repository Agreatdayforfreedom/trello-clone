import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";
import { CopyList, CreateList, DeleteList, UpdateList } from "./schema";
import { List } from "@prisma/client";

export type InputType = z.infer<typeof CreateList>;
export type ReturnType = ActionState<InputEvent, List>;

export type UpdateInputType = z.infer<typeof UpdateList>;
export type UpdateReturnType = ActionState<InputEvent, List>;

export type DeleteInputType = z.infer<typeof DeleteList>;
export type DeleteReturnType = ActionState<InputEvent, List>;

export type CopyInputType = z.infer<typeof CopyList>;
export type CopyReturnType = ActionState<InputEvent, List>;
