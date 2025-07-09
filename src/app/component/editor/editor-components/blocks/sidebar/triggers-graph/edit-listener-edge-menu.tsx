"use client";

import {
    useTriggersGraph
} from "@/app/component/editor/editor-components/blocks/sidebar/triggers-graph/triggers-graph-context";
import {useEffect} from "react";

export default function EditListenerEdgeMenu() {
    const triggersGraph = useTriggersGraph();

    //const selectedEdge = triggersGraph.selectedEdge;

    useEffect(() => {
        console.log("selectedEdge:", triggersGraph.selectedEdge);
    }, [triggersGraph.selectedEdge]);


    if (!triggersGraph.selectedEdge) {
        return null;
    }

    const target_id = triggersGraph.selectedEdge?.target_block_id ?? null
    const self_id = triggersGraph.selectedEdge?.self_block_id ?? null

    return (
        <div
            className={"absolute bottom-2 left-2 w-1/2 m-3 bg-gray-100 h-[85dvh] rounded-xl p-2 m-2 text-black"}>
            <button className={"absolute top-1 right-1 m-2 p-2 rounded-full text-white bg-black"} onClick={() => triggersGraph.setSelectedEdge(null)}>
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
                            <span>is listening to event: </span>
                            <span
                                className={"text-black-700 font-bold"}>{triggersGraph.selectedEdge.target_event}</span>
                        </div>
                        <div>
                            <span>from: </span>
                            <span
                                className={"text-green-500 font-bold"}>{triggersGraph.blocks[target_id].props.friendly_name}</span>
                        </div>
                    </div>
                </div>

                <div>

                </div>
            </div>
        </div>

    )
}