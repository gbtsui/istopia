"use client";

import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    Controls, OnConnect, OnDelete, OnEdgesChange,
    OnNodesChange,
    ReactFlow,
    //useStoreApi
} from "@xyflow/react";
import BlockFlowNode from "@/app/component/editor/editor-components/blocks/sidebar/triggers-graph/block-flow-node";
import {useCallback} from "react";
import {BlockNodeData, BlockNodeEdge} from "@/app/types";
import '@xyflow/react/dist/style.css';
import {EngineEventListener} from "@/app/engine";
import {
    useTriggersGraph
} from "@/app/component/editor/editor-components/blocks/sidebar/triggers-graph/triggers-graph-context";
import ListenerEdge from "@/app/component/editor/editor-components/blocks/sidebar/triggers-graph/listener-edge";
import EditListenerEdgeMenu
    from "@/app/component/editor/editor-components/blocks/sidebar/triggers-graph/edit-listener-edge-menu";

const nodeTypes = {
    blockNode: BlockFlowNode
}

const edgeTypes = {
    listenerEdge: ListenerEdge
}

export default function TriggersGraph() {
    //const store = useStoreApi()

    const {
        currentPageId,
        //pages,
        currentPage,
        editPage,
        editBlock,
        moveBlockCoordinates,
        //blocks,
        blockNodes,
        setBlockNodes,
        edges,
        setEdges,
        //selectedEdge,
        //setSelectedEdge,
    } = useTriggersGraph()

    //const blockNodes = (currentPage && currentPage.blockNodes) ?? [];


    const onNodesChange: OnNodesChange = useCallback(
        (changes) => {
            if (!currentPage) return;
            changes.forEach((change) => {
                if (change.type === "position") {
                    const block_id = change.id;
                    const new_position = change.position;
                    //const page_block_nodes = {...currentPage?.blockNodes}
                    //const block_data = {...currentPage.blockNodes[block_id]};
                    //page_block_nodes[block_id].position = new_position ?? block_data.position;
                    //editPage(currentPageId as string, {blockNodes: {...page_block_nodes}})
                    moveBlockCoordinates(currentPageId as string, block_id, new_position);
                }
            });
            //@ts-ignore This will not break anything, hopefully. Teehee :3
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

            const sourceBlock = {...currentPage.blocks}[change.source];
            const targetBlock = {...currentPage.blocks}[change.target];

            if (!sourceBlock || !targetBlock) {
                return setEdges((edges) => addEdge(change, edges));
            }

            const newListener: EngineEventListener = {
                self_block_id: change.target,
                action: change.targetHandle as string,
                target_block_id: change.source,
                target_event: (sourceBlock.type + ":" + change.sourceHandle),
                logical_conditions: []
            };

            // Check if identical listener already exists
            const exists = targetBlock.props.listeners.some((listener) => {
                return (
                    listener.self_block_id === newListener.self_block_id &&
                    listener.action === newListener.action &&
                    listener.target_block_id === newListener.target_block_id &&
                    listener.target_event === newListener.target_event
                );
            });

            if (!exists) {
                targetBlock.props.listeners.push(newListener);
                editBlock(currentPageId, targetBlock.props.id, targetBlock.props);
            }

            setEdges((edges) => addEdge({
                ...change,
                id: `${newListener.target_block_id}-${newListener.target_event}.${newListener.action}-${newListener.self_block_id}`,
                type: "listenerEdge",
                source: newListener.target_block_id,
                sourceHandle: newListener.target_event.split(":")[1],
                target: newListener.self_block_id,
                targetHandle: newListener.action,
                data: { listener: newListener }
            }, edges));
        },
        [editBlock, currentPage, currentPageId]
    );

    // @ts-ignore I have strict typing here with {friendly_name: string, type: string} instead of Record<string, unknown>
    const onDelete: OnDelete = useCallback(
        (changes: { nodes: BlockNodeData[], edges: BlockNodeEdge[] }) => {
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
            //const current_page_blockNodes = {...currentPage.blockNodes}
            //const current_page_blocks = {...currentPage.blocks}
            //nodes.forEach((node) => {
            //    delete current_page_blockNodes[node.id];
            //})
            //editPage(currentPageId, {blockNodes: current_page_blockNodes, blocks: current_page_blocks})
            nodes.forEach((node) => {
                moveBlockCoordinates(currentPageId, node.id, undefined)
            })
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
                       edgeTypes={edgeTypes}
                       edges={edges}
                       onNodesChange={onNodesChange}
                       onEdgesChange={onEdgesChange}
                       onConnect={onConnect}
                       onDelete={onDelete}>
                <Background/>
                <Controls/>
            </ReactFlow>
            <EditListenerEdgeMenu/>
        </div>
    )
}

//TODO: add logical operators and stuff connected to edges
//TODO: add dynamic page switching/other dynamic actions
