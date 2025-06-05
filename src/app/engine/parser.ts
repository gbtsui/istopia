"use server";

import {z} from "zod"
import {Block, PieceContent} from "@/app/types";
import {Condition, EngineEventListener, LogicalCondition} from "@/app/engine/engine";

const BlockPropsSchema = z.object({
    id: z.string(),
    content: z.array(z.string()).optional(),
    children: z.array(z.lazy(() => BlockSchema)).optional(),
    className: z.string().optional(),
    listeners: z.array(z.lazy(() => EngineEventListenerSchema)),
    additional_props: z.record(z.string(), z.union([z.string(), z.boolean(), z.number()])).optional()
})

const EngineEventListenerSchema: z.ZodType<EngineEventListener> = z.object({
    self_block_id: z.string(),
    target_block_id: z.string(),
    target_event: z.string(),
    action: z.string(),
    logical_conditions: z.array(z.lazy(() => LogicalConditionSchema))
})

const ConditionSchema: z.ZodType<Condition> = z.object({
    key: z.string(),
    operator: z.union([
        z.literal("=="),
        z.literal("!="),
        z.literal(">"),
        z.literal("<")
    ]),
    side_1: z.any(),
    side_2: z.any(),
})

const LogicalConditionSchema: z.ZodType<LogicalCondition> = z.object({
    key: z.string(),
    operator: z.union([
        z.literal("AND"),
        z.literal("OR"),
        z.literal("NOT")
    ]),
    conditions: z.array(z.lazy(() => LogicalConditionSchema.or(ConditionSchema)))
})

const BlockSchema: z.ZodType<Block> = z.lazy(() =>
    z.object({
        type: z.string(),
        props: BlockPropsSchema,
        //children: z.array(z.lazy(() => BlockSchema)).optional()
    })
)

const PageSchema = z.object({
    blocks: z.array(BlockSchema),
    page_number: z.number(),
})

const PieceContentSchema = z.object({
    pages: z.array(PageSchema),
})

export default async function Parse(data: unknown): Promise<PieceContent> {
    return PieceContentSchema.parseAsync(data) //technically this is a validator i guess?
}
