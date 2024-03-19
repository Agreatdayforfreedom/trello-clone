import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";
import { Card } from "@prisma/client";
import { CreateCard } from "./schema";

export type InputType = z.infer<typeof CreateCard>;
export type ReturnType = ActionState<InputEvent, Card>;

// export type UpdateInputType = z.infer<typeof UpdateList>;
// export type UpdateReturnType = ActionState<InputEvent, List>;

// export type DeleteInputType = z.infer<typeof DeleteList>;
// export type DeleteReturnType = ActionState<InputEvent, List>;
