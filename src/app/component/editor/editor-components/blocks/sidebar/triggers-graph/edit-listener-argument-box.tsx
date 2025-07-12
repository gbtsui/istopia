"use client";

import {
    useTriggersGraph
} from "@/app/component/editor/editor-components/blocks/sidebar/triggers-graph/triggers-graph-context";
import {BlockActionsList} from "@/app/engine/block-list";
import {useEditorStore} from "@/app/component/editor/state/zustand";

export default function EditListenerArgumentBox() {
    const triggersGraph = useTriggersGraph();
    const editorStore = useEditorStore();
    const selectedEdge = triggersGraph.selectedEdge;

    if (!selectedEdge) {
        return null;
    }


    const target_id = triggersGraph.selectedEdge?.target_block_id as string
    const self_id = triggersGraph.selectedEdge?.self_block_id as string
    const blockActionName = triggersGraph.selectedEdge?.action as string
    const selfBlockType = triggersGraph.blocks[self_id].type
    const targetBlockType = triggersGraph.blocks[target_id].type
    const blockAction = BlockActionsList[selfBlockType][blockActionName];

    //const eventDescription = BlockEventsList[targetBlockType][eventName.split(":")[1]]



    if (blockAction.arg_type === "null") return null;

    if (blockAction.arg_input_type === "dropdown") {
        if (blockAction.arg_input_choices_source === "outward_connections") {
            const connections = triggersGraph.currentPage?.outward_connections as string[]
            return (
                <select>
                    {
                        connections.map(connection => (
                            <option value={connection} key={connection}>{editorStore.content.pages[connection].friendly_name}</option>
                        ))
                    }
                </select>
            )
        }
    }

    return (
        <div>
            <input/>
        </div>
    )
}