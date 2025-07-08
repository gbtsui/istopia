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
import {
    useTriggersGraph
} from "@/app/component/editor/editor-components/blocks/sidebar/triggers-graph/triggers-graph-context";

const nodeTypes = {
    blockNode: BlockFlowNode
}

export default function TriggersGraph() {
    const store = useStoreApi()

    const {
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
    } = useTriggersGraph()

    //const blockNodes = (currentPage && currentPage.blockNodes) ?? [];



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
