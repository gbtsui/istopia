"use client";

import {Handle, Node, NodeProps, Position} from "@xyflow/react";

type BlockFlowNodeProps = Node<{
    friendly_name: string,
    events: string[], //right side - emitted events
    actions: string[] //left side - actions to take
}>

export default function BlockFlowNode(props: NodeProps<BlockFlowNodeProps>) {
    return (
        <div style={{
            padding: 15,
            background: "#eee",
            position: "relative"
        }}>
            <div style={{
                display: "flex",
                position: "absolute",
                height: "100%",
                right: 0,
                flexDirection: "column",
                top: 0,
                justifyContent: "space-between"
            }}>
                {props.data.actions.map((action) => (
                    <div key={action}>
                        <Handle type={"target"} position={Position.Left} id={action}
                                style={{
                                    position: "relative",
                                    transform: "none",
                                    top: "auto"
                                }}/>
                        <p>{action}</p>
                    </div>
                ))}
            </div>

            <div className={"p-3 bg-gray-200 flex text-black text-center grow rounded-lg"}>
                <div>{props.data.friendly_name}</div>
            </div>

            <div style={{
                display: "flex",
                position: "absolute",
                height: "100%",
                right: 0,
                flexDirection: "column",
                top: 0,
                justifyContent: "space-between"
            }}>
                {props.data.events.map((event, index) => (
                    <div key={event} className={"items-end"}>
                        <Handle type={"source"} position={Position.Right} id={event}
                                style={{
                                    position: "relative",
                                    transform: "none",
                                    top: "auto"
                                }}/>
                        <p>{event}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}