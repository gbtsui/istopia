"use client";

import {Background, Controls, MiniMap, ReactFlow, useStoreApi} from "@xyflow/react";
import {useEditorStateStore, useEditorStore} from "@/app/component/editor/state/zustand";
import BlockFlowNode from "@/app/component/editor/editor-components/blocks/sidebar/triggers-graph/block-flow-node";
import {useCallback, useEffect, useState} from "react";
import {Block, BlockNodeData, BlockNodeEdge} from "@/app/types";
import '@xyflow/react/dist/style.css';

const nodeTypes = {
    blockNode: BlockFlowNode
}

export default function TriggersGraph() {
    const store = useStoreApi()

    const currentPageId = useEditorStateStore((state) => state.current_page)
    const pages = useEditorStore((state) => state.content.pages)
    const currentPage = currentPageId? pages[currentPageId] : null

    const blocks = (currentPage && currentPage.blocks) ?? {}; //i love learning combinations of logic operators :D
    //const blockNodes = (currentPage && currentPage.blockNodes) ?? [];

    const [blockNodes, setBlockNodes] = useState<BlockNodeData[]>([]);
    const [edges, setEdges] = useState<BlockNodeEdge[]>([]); //according to the Consensus Of The Fathers edging is not beneficial

    const update_nodes = useCallback(() => {
        //if (!blockNodes.length) return
        console.log("page data:", currentPage)
        const blocks_list: Block[] = Object.entries(blocks).map(([,v]) => v)
        const new_edges = blocks_list.map((block) => {
            return block.props.listeners.map((listener) => {
                return {
                    id: `${listener.target_block_id}-${listener.target_event}.${listener.action}-${listener.self_block_id}`,
                    source: listener.target_block_id,
                    sourceHandle: listener.target_event,
                    target: listener.self_block_id,
                    targetHandle: listener.action
                } as BlockNodeEdge
            })
        }).flat()
        console.log("blocks_list", blocks_list)
        console.log("blockNodes", currentPage?.blockNodes)

        setEdges(new_edges)
        setBlockNodes(currentPage?.blockNodes || [])
    }, [currentPage])

    useEffect(() => {
        console.log("updating nodes, useEffect running")
        update_nodes()
        console.log(blockNodes)
    }, [currentPage, update_nodes])

    if (!currentPage) {
        return null
    }


    return (
        <div className={"w-full h-full"}>
            <ReactFlow proOptions={{hideAttribution: true}}
            nodeTypes={nodeTypes}
            nodes={blockNodes}
            edges={edges}>
                <Background/>
                <Controls/>
            </ReactFlow>
        </div>
    )
}