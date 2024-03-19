import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";
import { Card, List } from "@prisma/client";
import { UpdateCardOrder, UpdateListOrder } from "./schema";

export type InputType = z.infer<typeof UpdateListOrder>;
export type ReturnType = ActionState<InputEvent, List[]>;

export type CardInputType = z.infer<typeof UpdateCardOrder>;
export type CardReturnType = ActionState<InputEvent, Card[]>;
