"use server";

import {z} from "zod"
import {Block, PieceContent} from "@/app/types";

const BlockPropsSchema = z.object({
    content: z.array(z.string()),
    children: z.array(z.lazy(() => BlockSchema)).optional(),
})

const BlockSchema: z.ZodType<Block> = z.lazy(() =>
    z.object({
        type: z.string(),
        styling: z.string(),
        props: BlockPropsSchema,
        //children: z.array(z.lazy(() => BlockSchema)).optional()
    })
)

const PageSchema = z.object({
    blocks: z.array(BlockSchema),
})

const PieceContentSchema = z.object({
    pages: z.array(PageSchema),
})

export default async function Parse(data: unknown): Promise<PieceContent> {
    return PieceContentSchema.parseAsync(data) //technically this is a validator i guess?
}
