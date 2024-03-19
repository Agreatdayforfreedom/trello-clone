import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";
import { CreateBoard, DeleteBoard, UpdateBoard } from "./schema";
import { Board } from "@prisma/client";

export type InputType = z.infer<typeof CreateBoard>;
export type ReturnType = ActionState<InputEvent, Board>;

export type UpdateInputType = z.infer<typeof UpdateBoard>;
export type UpdateReturnType = ActionState<InputEvent, Board>;

export type DeleteInputType = z.infer<typeof DeleteBoard>;
export type DeleteReturnType = ActionState<InputEvent, Board>;
