"use server";

import {z} from "zod"
import {Block, BlockProps, Page, PageNodeData, PieceContent} from "@/app/types";
import {Condition, EngineEventListener, LogicalCondition} from "@/app/engine/engine";

const BlockPropsSchema: z.ZodType<BlockProps> = z.object({
    id: z.string(),
    friendly_name: z.string(),
    content: z.array(z.string()).optional(),
    children: z.array(z.lazy(() => BlockSchema)).optional(),
    className: z.string().optional(),
    listeners: z.array(z.lazy(() => EngineEventListenerSchema)),
    children_ids: z.array(z.string()).optional(),
    parent_id: z.string().optional(),
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

const PageNodeSchema: z.ZodType<PageNodeData> = z.object({
    id: z.string(),
    position: z.object({
        x: z.number(),
        y: z.number()
    }),
    data: z.object({
        friendly_name: z.string(),
        page_id: z.string(),
        is_first: z.boolean()
    }),
    type: z.union([z.literal("pageNode"), z.undefined()]) //can be further expanded eventually later
})

const PageSchema: z.ZodType<Page> = z.object({
    blocks: z.record(z.string(), BlockSchema),
    friendly_name: z.string(),
    id: z.string(),
    outward_connections: z.array(z.string()),
    is_first: z.boolean(),
    flow_node_data: PageNodeSchema
})

const PieceContentSchema: z.ZodType<PieceContent> = z.object({
    pages: z.record(z.string(), PageSchema)
})

export default async function Parse(data: unknown): Promise<PieceContent> {
    return PieceContentSchema.parseAsync(data) //technically this is a validator i guess?
}
