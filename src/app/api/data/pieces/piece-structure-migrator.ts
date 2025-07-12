import { Page, PieceContent, BlockNodeData } from "@/app/legacy/types/types-1";
import { BlockFlowNodeData, Block } from "@/app/types";

type File2Block = Omit<Block, "position">;

interface File2Page {
    blocks: Record<string, File2Block>;
    blockNodes?: Record<string, BlockNodeData>;
    friendly_name: string;
    id: string;
    outward_connections: string[];
    is_first: boolean;
    flow_node_data: unknown;
}

export interface File2PieceContent {
    pages: Record<string, File2Page>;
    data_version?: string;
}

export function migratePieceContentV1_V2(content: File2PieceContent | null | undefined) {
    if (!content) return content;

    if (content.data_version && content.data_version !== "V1") {
        return content as PieceContent;
    }

    const migratedPages: Record<string, Page> = {};

    for (const [pageId, page] of Object.entries(content.pages)) {
        const migratedBlocks: Record<string, Block> = {};

        for (const [blockId, block] of Object.entries(page.blocks)) {
            const nodeData = page.blockNodes?.[blockId];
            migratedBlocks[blockId] = {
                ...block,
                position: nodeData?.position ?? { x: 0, y: 0 },
            };
        }

        /*
        const migratedBlockNodes: Record<string, BlockNodeData> = {};
        for (const [nodeId, node] of Object.entries(page.blockNodes ?? {})) {
            const rawData = node.data as Partial<BlockFlowNodeData> | undefined;

            migratedBlockNodes[nodeId] = {
                ...node,
                data: {
                    friendly_name: rawData?.friendly_name ?? "Unnamed Block",
                    type: rawData?.type ?? "unknown",
                    ...(rawData || {}),
                },
            };
        }*/

        migratedPages[pageId] = <Page>{
            //...page,
            friendly_name: page.friendly_name,
            id: pageId,
            outward_connections: page.outward_connections,
            is_first: page.is_first,
            flow_node_data: page.flow_node_data,
            blocks: migratedBlocks,
            //blockNodes: migratedBlockNodes,
        };
    }

    return {
        ...content,
        pages: migratedPages,
        data_version: "V2",
    }
}
