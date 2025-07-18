"use client";

import {
    useTriggersGraph
} from "@/app/component/editor/editor-components/blocks/sidebar/triggers-graph/triggers-graph-context";
import {BlockActionsList} from "@/app/engine/block-list";
import {useEditorStore} from "@/app/component/editor/state/zustand";
import {useEffect, useState} from "react";

export default function EditListenerArgumentBox() {
    const triggersGraph = useTriggersGraph();
    //const editorStore = useEditorStore();
    const selectedEdge = triggersGraph.selectedEdge;

    const target_id = triggersGraph.selectedEdge?.target_block_id as string
    const self_id = triggersGraph.selectedEdge?.self_block_id as string
    const blockActionName = triggersGraph.selectedEdge?.action as string
    const selfBlockType = triggersGraph.blocks[self_id].type
    const targetBlockType = triggersGraph.blocks[target_id].type
    const blockAction = BlockActionsList[selfBlockType][blockActionName];

    const changeBlockListenerArguments = useEditorStore((state) => state.changeBlockListenerArguments)
    const pages = useEditorStore((state) => state.content.pages)

    //const eventDescription = BlockEventsList[targetBlockType][eventName.split(":")[1]]
    const [arbitraryArgument, setArbitraryArgument] = useState<string | number | boolean | undefined>()

    const changeArgument = (newArg: string | number | boolean) => {
        console.log(newArg)

        if (!triggersGraph.currentPageId || !triggersGraph.selectedEdge) return
        changeBlockListenerArguments(triggersGraph.currentPageId, self_id, {listener_target_id: target_id, listener_target_event: triggersGraph.selectedEdge?.target_event, self_action: blockActionName}, newArg)
    }

    useEffect(() => {
        if (
            arbitraryArgument === undefined &&
            blockAction.arg_type === "string" &&
            blockAction.arg_input_type === "dropdown" &&
            blockAction.arg_input_choices_source === "outward_connections"
        ) {
            const currently_selected_page =
                pages[triggersGraph.currentPageId as string]
                    .blocks[self_id].props.listeners.find(
                    (l) =>
                        l.target_block_id === target_id &&
                        l.action === blockActionName &&
                        l.target_event === triggersGraph.selectedEdge?.target_event
                );

            if (currently_selected_page?.arbitrary_argument) {
                setArbitraryArgument(currently_selected_page.arbitrary_argument);
            }
        }
    }, [
        arbitraryArgument,
        blockAction.arg_type,
        blockAction,
        blockAction,
        triggersGraph.currentPageId,
        self_id,
        target_id,
        blockActionName,
        triggersGraph.selectedEdge?.target_event,
        pages,
    ]);


    if (!selectedEdge) {
        return null;
    }

    if (blockAction.arg_type === "string" &&
        blockAction.arg_input_type === "dropdown") {
        if (blockAction.arg_input_choices_source === "outward_connections") {
            const connections = triggersGraph.currentPage?.outward_connections as string[];

            return (
                <div>
                    <div className={"text-sm"}>{blockAction.arg_description}</div>
                    <div>Currently selected: {arbitraryArgument}</div>
                    <div>
                        <select
                            className={"p-2 m-2 bg-gray-100 rounded-lg"}
                            onChange={(e) => {
                                setArbitraryArgument(e.target.value);
                                changeArgument(e.target.value);
                            }}
                            value={typeof arbitraryArgument === "string"? arbitraryArgument : ""}
                        >
                            <option value="">
                                -- select an option --
                            </option>
                            {connections.map((connection) => (
                                <option
                                    value={connection}
                                    key={connection}
                                >
                                    {pages[connection].friendly_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            );
        }
    }
    if (blockAction.arg_type === "string") {
        return (
            <input type={"text"}/>
        )
    }

    if (blockAction.arg_type === "number") {
        return (
            <input type={"number"}/>
        )
    }

    if (blockAction.arg_type === "boolean") {
        return (
            <input type={"checkbox"}/>
        )
    }


    return null
}