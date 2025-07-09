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

    return (
        <div className={"absolute bottom-0 left-0 w-1/2 m-3 bg-white"}>
            thing :D
        </div>
    )
}