"use client";

import {ReactFlow, useStoreApi} from "@xyflow/react";
import {useEditorStateStore, useEditorStore} from "@/app/component/editor/state/zustand";
import BlockFlowNode from "@/app/component/editor/editor-components/blocks/sidebar/triggers-graph/block-flow-node";

const nodeTypes = {
    blockNode: BlockFlowNode
}

export default function TriggersGraph() {
    const store = useStoreApi()

    const currentPageId = useEditorStateStore((state) => state.current_page)
    const pages = useEditorStore((state) => state.content.pages)
    const currentPage = currentPageId? pages[currentPageId] : null

    const blocks = (currentPage && currentPage.blocks) ?? {}; //i love learning combinations of logic operators :D
    const blockNodes = (currentPage && currentPage.blockNodes) ?? [];


    if (!currentPage) {
        return null
    }


    return (
        <div className={"w-full h-full"}>
            <ReactFlow proOptions={{hideAttribution: true}}
            nodeTypes={nodeTypes}/>
        </div>
    )
}