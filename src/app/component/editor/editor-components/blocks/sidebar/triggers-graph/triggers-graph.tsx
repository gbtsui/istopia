"use client";

import {applyNodeChanges, Background, Controls, OnNodesChange, ReactFlow, useStoreApi} from "@xyflow/react";
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
    const editPage = useEditorStore((state) => state.editPage)

    const blocks = (currentPage && currentPage.blocks) ?? {}; //i love learning combinations of logic operators :D
    //const blockNodes = (currentPage && currentPage.blockNodes) ?? [];

    const [blockNodes, setBlockNodes] = useState<BlockNodeData[]>([]);
    const [edges, setEdges] = useState<BlockNodeEdge[]>([]); //according to the Consensus Of The Fathers edging is not beneficial

    const update_nodes = useCallback(() => {
        //if (!blockNodes.length) return
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

        setEdges(new_edges)
        setBlockNodes(Object.values(currentPage?.blockNodes || {}))
    }, [currentPage?.blockNodes])

    const onNodesChange: OnNodesChange = useCallback(
        (changes) => {
            if (!currentPage) return;
            changes.forEach((change) => {
                if (change.type === "position") {
                    const block_id = change.id;
                    const new_position = change.position;
                    const page_block_nodes = {...currentPage?.blockNodes}
                    const block_data = {...currentPage.blockNodes[block_id]};
                    page_block_nodes[block_id].position = new_position ?? block_data.position;
                    editPage(currentPageId as string, {blockNodes: {...page_block_nodes}})
                }
            });
            setBlockNodes((nds: BlockNodeData[]): BlockNodeData[] => applyNodeChanges(
                changes, nds
            ))
        },
        [currentPage, setBlockNodes, editPage]
    )

    useEffect(() => {
        update_nodes()
    }, [currentPage?.blockNodes, update_nodes])

    if (!currentPage) {
        return null
    }


    return (
        <div className={"w-full h-full"}>
            <ReactFlow proOptions={{hideAttribution: true}}
            nodeTypes={nodeTypes}
            nodes={blockNodes}
            edges={edges}
            onNodesChange={onNodesChange}>
                <Background/>
                <Controls/>
            </ReactFlow>
        </div>
    )
}