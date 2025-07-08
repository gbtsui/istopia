"use client"

import {BaseEdge, Edge, EdgeLabelRenderer, EdgeProps, getStraightPath} from "@xyflow/react"
import {EngineEventListener} from "@/app/engine";
import {
    useTriggersGraph
} from "@/app/component/editor/editor-components/blocks/sidebar/triggers-graph/triggers-graph-context";

type ListenerEdgeProps = Edge<{ eventListener: EngineEventListener }, 'custom'>;


export default function ListenerEdge({
                                         id,
                                         sourceX,
                                         sourceY,
                                         targetX,
                                         targetY,
                                     }: EdgeProps<ListenerEdgeProps>) {
    const triggersGraph = useTriggersGraph()

    const [edgePath] = getStraightPath({sourceX, sourceY, targetX, targetY})

    return (
        <BaseEdge id={id} path={edgePath}>
            <EdgeLabelRenderer>
                <p>thing</p>
            </EdgeLabelRenderer>
        </BaseEdge>
    )
}