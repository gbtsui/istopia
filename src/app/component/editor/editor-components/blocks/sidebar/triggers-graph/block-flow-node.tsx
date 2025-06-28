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
        }} className={"min-w-36 min-h-48 flex flex-row"}>
            <div style={{
                display: "flex",
                position: "absolute",
                height: "100%",
                left: 0,
                flexDirection: "column",
                top: 0,
                justifyContent: "space-evenly"
            }} className={"w-full"}>
                {props.data.actions.map((action) => (
                    <div key={action} className={"text-black text-center flex items-center"}>
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
                justifyContent: "space-evenly"
            }}>
                {props.data.events.map((event) => (
                    <div key={event} className={"text-black text-center flex items-center"}>
                        <p>{event}</p>
                        <Handle type={"source"} position={Position.Right} id={event}
                                style={{
                                    position: "relative",
                                    transform: "none",
                                    top: "auto"
                                }}/>
                    </div>
                ))}
            </div>
        </div>
    )
}