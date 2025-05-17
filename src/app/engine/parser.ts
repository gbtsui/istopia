"use server";

import {z} from "zod"

export interface BlockProps {
    text: string[];
}

const BlockPropsSchema = z.object({
    text: z.array(z.string())
})

export interface Block {
    type: string,
    styling: string,
    children?: Array<Block>,
    props: BlockProps
}

const BlockSchema: z.ZodType<Block> = z.lazy(() =>
    z.object({
        type: z.string(),
        styling: z.string(),
        props: BlockPropsSchema,
        children: z.array(z.lazy(() => BlockSchema)).optional()
    })
)

export interface Page {
    blocks: Array<Block>
}

const PageSchema = z.object({
    blocks: z.array(BlockSchema),
})

export interface PieceContent {
    pages: Array<Page>
}

const PieceContentSchema = z.object({
    pages: z.array(PageSchema),
})

export default async function Parse(data: unknown): Promise<PieceContent> {
    return PieceContentSchema.parseAsync(data) //technically this is a validator i guess?
}
