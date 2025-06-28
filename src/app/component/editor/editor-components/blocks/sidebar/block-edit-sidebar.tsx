"use client";

import {useEditorStateStore} from "@/app/component/editor/state/zustand";
import {ReactFlowProvider} from "@xyflow/react";
import TriggersGraph from "@/app/component/editor/editor-components/blocks/sidebar/triggers-graph/triggers-graph";

export default function BlockEditSidebar() {
    const selected_block = useEditorStateStore((state) => state.selected_block);

    //if (!selected_block) {
    //    return null;
    //}

    return (
        <div className={"w-1/2 p-3 m-5 bg-gray-800 rounded-2xl"}>
            edit sidebar
            <div className={"flex flex-col h-full"}>
                <ReactFlowProvider>
                    <TriggersGraph/>
                </ReactFlowProvider>
            </div>
        </div>
    )
}