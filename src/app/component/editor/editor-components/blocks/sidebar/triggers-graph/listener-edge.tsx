"use client"

import {BaseEdge, Edge, EdgeLabelRenderer, EdgeProps, getStraightPath} from "@xyflow/react"
import {EngineEventListener} from "@/app/engine";
import {
    useTriggersGraph
} from "@/app/component/editor/editor-components/blocks/sidebar/triggers-graph/triggers-graph-context";

type ListenerEdgeProps = Edge<{ eventListener: EngineEventListener }, 'listener-edge'>;


export default function ListenerEdge({
                                         id,
                                         sourceX,
                                         sourceY,
                                         targetX,
                                         targetY,
                                         data
                                     }: EdgeProps<ListenerEdgeProps>) {
    const triggersGraph = useTriggersGraph()

    const [edgePath, labelX, labelY] = getStraightPath({sourceX, sourceY, targetX, targetY})

    return (
        <BaseEdge id={id} path={edgePath}>
            <EdgeLabelRenderer>
                <button
                    onClick={
                        //() => console.log("clicked")
                    () => triggersGraph.setSelectedEdge(data?.eventListener ?? null)
                }
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                        pointerEvents: 'all',
                    }}
                    className={"nodrag nopan p-2 bg-white text-black cursor-pointer"}>
                    edit
                </button>
            </EdgeLabelRenderer>
        </BaseEdge>
    )
}