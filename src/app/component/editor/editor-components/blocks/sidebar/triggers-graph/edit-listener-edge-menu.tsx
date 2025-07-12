"use client";

import {
    useTriggersGraph
} from "@/app/component/editor/editor-components/blocks/sidebar/triggers-graph/triggers-graph-context";
import {useEffect} from "react";
import {BlockActionsList, BlockEventsList} from "@/app/engine/block-list";
import EditListenerArgumentBox
    from "@/app/component/editor/editor-components/blocks/sidebar/triggers-graph/edit-listener-argument-box";

function describeEventArgType(argType: "string" | "boolean" | "number" | "null"): string {
    switch (argType) {
        case "string":
            return "emits a string as the default argument when triggered";
        case "boolean":
            return "emits a boolean as the default argument when triggered";
        case "number":
            return "emits a number as the default argument when triggered";
        case "null":
            return "does not emit a default argument when triggered";
        default:
            return "";
    }
}

function describeActionArgType(argType: "string" | "boolean" | "number" | "null"): string {
    switch (argType) {
        case "string":
            return "takes a string as an argument";
        case "boolean":
            return "takes a boolean as an argument";
        case "number":
            return "takes a number as an argument";
        case "null":
            return "does not respond to any arguments"
    }
}

export default function EditListenerEdgeMenu() {
    const triggersGraph = useTriggersGraph();

    //const selectedEdge = triggersGraph.selectedEdge;

    if (!triggersGraph.selectedEdge) {
        return null;
    }

    const target_id = triggersGraph.selectedEdge?.target_block_id ?? null
    const self_id = triggersGraph.selectedEdge?.self_block_id ?? null


    const blockActionName: string = triggersGraph.selectedEdge?.action
    const selfBlockType = triggersGraph.blocks[self_id].type
    const targetBlockType = triggersGraph.blocks[target_id].type
    const blockAction = BlockActionsList[selfBlockType][blockActionName];

    const eventName: string = triggersGraph.selectedEdge?.target_event
    const eventDescription = BlockEventsList[targetBlockType][eventName.split(":")[1]]
    //const eventDescription = BlockEventsList[targetBlockType][eventName.split(":")[1]]

    return (
        <div
            className={"absolute bottom-2 left-2 w-1/2 m-3 bg-gray-100 h-[85dvh] rounded-xl p-2 m-2 text-black"}>
            <button className={"absolute top-1 right-1 m-2 p-2 rounded-full text-white bg-black"}
                    onClick={() => triggersGraph.setSelectedEdge(null)}>
                x
            </button>
            <div>
                <div className={"text-center text-2xl"}>edit listener</div>
                <div className={"text-center text-sm text-gray-500"}>

                    <div className={""}>
                        <div>
                            <span>block </span>
                            <span
                                className={"text-blue-500 font-bold"}>{triggersGraph.blocks[self_id].props.friendly_name}</span>
                        </div>
                        <div>
                            <span>will trigger action: </span>
                            <span className={"text-red-500 font-bold"}>{triggersGraph.selectedEdge.action}</span>
                        </div>
                        <div>
                            <span>when event: </span>
                            <span
                                className={"text-black-700 font-bold"}>{triggersGraph.selectedEdge.target_event}</span>
                        </div>
                        <div>
                            <span>is heard from: </span>
                            <span
                                className={"text-green-500 font-bold"}>{triggersGraph.blocks[target_id].props.friendly_name}</span>
                        </div>
                    </div>
                </div>

                <div className={"p-2 m-2 text-center"}>
                    <div>
                        <span
                            className={"text-md"}>Event {eventName} {describeEventArgType(eventDescription.default_arg_type)}</span>
                        <div className={"text-xs"}>{eventDescription.event_description}</div>
                    </div>
                    <div>
                        <span
                            className={"text-md"}>Action {blockActionName} {describeActionArgType(blockAction.arg_type)}</span>
                        <div className={"text-xs"}>{blockAction.action_description}</div>
                    </div>
                    <div className={"mt-5"}>
                        <p className={"text-sm"}>{blockAction.arg_type === "null" && <>(This action doesn't respond to any arguments but you can override them anyways if you want.)</>}</p>
                        <EditListenerArgumentBox/>
                    </div>
                </div>
            </div>
        </div>
    )
}