"use client";

import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    Controls, OnConnect, OnDelete, OnEdgesChange,
    OnNodesChange,
    ReactFlow,
    useStoreApi
} from "@xyflow/react";
import {useEditorStateStore, useEditorStore} from "@/app/component/editor/state/zustand";
import BlockFlowNode from "@/app/component/editor/editor-components/blocks/sidebar/triggers-graph/block-flow-node";
import {useCallback, useEffect, useState} from "react";
import {Block, BlockNodeData, BlockNodeEdge} from "@/app/types";
import '@xyflow/react/dist/style.css';
import {EngineEventListener} from "@/app/engine";

const nodeTypes = {
    blockNode: BlockFlowNode
}

export default function TriggersGraph() {
    const store = useStoreApi()

    const currentPageId = useEditorStateStore((state) => state.current_page)
    const pages = useEditorStore((state) => state.content.pages)
    const currentPage = currentPageId? pages[currentPageId] : null
    const editPage = useEditorStore((state) => state.editPage)
    const editBlock = useEditorStore((state) => state.editBlock)
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

    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => {
            setEdges((edges) => applyEdgeChanges(changes, edges))
        },
        [setEdges]
    )

    const onConnect: OnConnect = useCallback(
        (change) => {
            if (!currentPage || !currentPageId) return;
            const sourceBlock = {...currentPage.blocks}[change.source] //the block that triggers an event
            const targetBlock = {...currentPage.blocks}[change.target] //the block that listens to an event
            if (!sourceBlock) return setEdges((edges) => addEdge(change, edges))
            const newListener: EngineEventListener = {
                self_block_id: change.target,
                action: change.targetHandle as string,
                target_block_id: change.source,
                target_event: (sourceBlock.type + ":" + change.sourceHandle),
                logical_conditions: []
            }
            targetBlock.props.listeners.push(newListener);
            console.log("sourceBlock: ", sourceBlock);
            editBlock(currentPageId, targetBlock.props.id, targetBlock.props)

            setEdges((edges) => addEdge(change, edges))
        },
        [editBlock, currentPage]
    )

    const onDelete: OnDelete = useCallback(
        (changes: {nodes: BlockNodeData[], edges: BlockNodeEdge[]}) => {
            const {nodes, edges} = changes

            if (!currentPage || !currentPageId) return

            edges.forEach((edge) => {
                const listeningBlock = {...currentPage.blocks[edge.target]}
                listeningBlock.props.listeners = listeningBlock.props.listeners
                    .filter(listener =>
                        (listener.target_block_id !== edge.source)
                            &&
                        (listener.target_event !== edge.sourceHandle)
                    );
                editBlock(currentPageId, listeningBlock.props.id, listeningBlock.props)
            })
            const current_page_blockNodes = {...currentPage.blockNodes}
            const current_page_blocks = {...currentPage.blocks}
            nodes.forEach((node) => {
                delete current_page_blockNodes[node.id];
            })
            editPage(currentPageId, {blockNodes: current_page_blockNodes, blocks: current_page_blocks})
    },
    [currentPage, editPage, currentPageId]
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
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDelete={onDelete}>
                <Background/>
                <Controls/>
            </ReactFlow>
        </div>
    )
}

//TODO: add logical operators and stuff connected to edges
//TODO: add dynamic page switching/other dynamic actions
