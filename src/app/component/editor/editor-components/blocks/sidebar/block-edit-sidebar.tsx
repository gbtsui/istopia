"use client";

import {useEditorStateStore, useEditorStore} from "@/app/component/editor/state/zustand";
import {ReactFlowProvider} from "@xyflow/react";
import TriggersGraph from "@/app/component/editor/editor-components/blocks/sidebar/triggers-graph/triggers-graph";
import {useCallback, useState} from "react";
import {Block, BlockNodeData} from "@/app/types";

export default function BlockEditSidebar() {
    const selected_block = useEditorStateStore((state) => state.selected_block);
    const pages = useEditorStore((state) => state.content.pages);
    const current_page_id = useEditorStateStore((state) => state.current_page)
    const current_page = (current_page_id && pages[current_page_id]) || null;
    const blocks: Record<string, Block> | null = (current_page && current_page.blocks);
    //const existingFlowBlocks = current_page?.blockNodes || []
    const [selectedInsertableBlock, setSelectedInsertableBlock] = useState<Block>();

    const editPage = useEditorStore((state) => state.editPage);

    if (!current_page || !blocks) {
        return null;
    }

    //const existing_blocks = ((current_page?.blockNodes || []).map<[string, BlockNodeData]>((block) => [block.id, block]));
    const existing_flow_blocks = (current_page?.blockNodes || []).reduce<Record<string, BlockNodeData>>(
        (acc, blockNode) => {
            acc[blockNode.id] = blockNode;
            return acc;
        },
        {} as Record<string, BlockNodeData>
    );
    const non_existing_block_ids: string[] = Object.keys(blocks).filter((blockId) => existing_flow_blocks[blockId] === undefined)

    const insert_block_into_flow = useCallback(() => {
        console.log("button pressed, current block: ", selectedInsertableBlock)
        if (!selectedInsertableBlock) return;

        /*
        // Get the basic info about the viewport
        const {
            height,
            width,
            transform: [transformX, transformY, zoomLevel]
        } = store.getState();
        const zoomMultiplier = 1 / zoomLevel;

        // Figure out the center of the current viewport
        const centerX = -transformX * zoomMultiplier + (width * zoomMultiplier) / 2;
        const centerY =
            -transformY * zoomMultiplier + (height * zoomMultiplier) / 2;

         */

        const new_block_nodes = [...current_page.blockNodes];
        const new_node = {
            id: selectedInsertableBlock.props.id,
            position: {
                x: 0,//centerX,
                y: 0 //centerY //TODO: fix viewport centering for quality of life
            },
            data: {},
            type: "blockNode"
        } as BlockNodeData;
        new_block_nodes.push(new_node)
        console.log("new block nodes", new_block_nodes)

        editPage(current_page.id, {blockNodes: new_block_nodes});
    }, [current_page, selectedInsertableBlock]);

    return (
        <div className={"w-1/2 p-3 m-5 bg-gray-800 rounded-2xl"}>
            edit sidebar
            <div className={"flex flex-col h-full p-2 pb-4"}>
                <div className={"flex flex-col h-full"}>
                    <div className={"w-full p-2"}>
                        menus and stuff here<br/>
                        <div>
                            <button onClick={insert_block_into_flow}>insert into graph</button>
                            <select onChange={(e) => setSelectedInsertableBlock((e.target.value ? blocks[e.target.value] : undefined))}
                                className={"rounded-sm bg-white text-black"} value={selectedInsertableBlock && selectedInsertableBlock.props.id}>
                                <option value={undefined} key={"nothing"}>pick a block</option>
                                {
                                    non_existing_block_ids.map(blockId => (
                                        <option value={blockId} key={blockId}>{blocks[blockId].props.friendly_name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <ReactFlowProvider>
                    <TriggersGraph/>
                    </ReactFlowProvider>
                </div>
            </div>
        </div>
    )
}