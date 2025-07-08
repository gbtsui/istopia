"use client"

import {createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useEffect, useState} from "react";
import {Block, BlockNodeData, BlockNodeEdge, BlockProps, Page} from "@/app/types";
import {useEditorStateStore, useEditorStore} from "@/app/component/editor/state/zustand";

export const TriggersGraphContext = createContext<TriggersGraphType | null>(null);

export type TriggersGraphType = {
    currentPageId: string | null | undefined,
    pages: Record<string, Page>,
    currentPage: Page | null,
    editPage: (page_id: string, new_data: Partial<Page>) => void,
    editBlock: (page_id: string, block_id: string, new_props: BlockProps) => void,
    blocks: Record<string, Block>,
    blockNodes: BlockNodeData[],
    setBlockNodes: Dispatch<SetStateAction<BlockNodeData[]>>,
    edges: BlockNodeEdge[],
    setEdges: Dispatch<SetStateAction<BlockNodeEdge[]>>,
}

export const TriggersGraphProvider = ({children}: { children: ReactNode }) => {
    const currentPageId = useEditorStateStore((state) => state.current_page)
    const pages = useEditorStore((state) => state.content.pages)
    const currentPage = currentPageId ? pages[currentPageId] : null
    const editPage = useEditorStore((state) => state.editPage)
    const editBlock = useEditorStore((state) => state.editBlock)
    const blocks = (currentPage && currentPage.blocks) ?? {}; //i love learning combinations of logic operators :D

    const [blockNodes, setBlockNodes] = useState<BlockNodeData[]>([]);
    const [edges, setEdges] = useState<BlockNodeEdge[]>([]); //according to the Consensus Of The Fathers edging is not beneficial

    const update_nodes = useCallback(() => {
        //if (!blockNodes.length) return
        const blocks_list: Block[] = Object.entries(blocks).map(([, v]) => v)
        const new_edges = blocks_list.map((block) => {
            return block.props.listeners.map((listener) => {
                return {
                    id: `${listener.target_block_id}-${listener.target_event}.${listener.action}-${listener.self_block_id}`,
                    source: listener.target_block_id,
                    sourceHandle: listener.target_event.split(":")[1],
                    target: listener.self_block_id,
                    targetHandle: listener.action
                } as BlockNodeEdge
            })
        }).flat()

        setEdges(new_edges)
        console.log("update nodes run")
        setBlockNodes(Object.values(currentPage?.blockNodes || {}))
    }, [currentPage?.blockNodes])

    useEffect(() => {
        update_nodes()
    }, [currentPage?.blockNodes, update_nodes])

    return (
        <TriggersGraphContext.Provider value={{
            currentPageId,
            pages,
            currentPage,
            editPage,
            editBlock,
            blocks,
            blockNodes,
            setBlockNodes,
            edges,
            setEdges
        }}>
            {children}
        </TriggersGraphContext.Provider>)
}

export const useTriggersGraph = () => {
    const context = useContext(TriggersGraphContext)
    if (!context) {
        throw new Error("useTriggersGraph must be used within a TriggersGraphProvider");
    }
    return context;
}
