"use client";

import {Handle, Node, NodeProps, Position} from "@xyflow/react";

type BlockFlowNodeProps = Node<{
    friendly_name: string,
    events: string[], //right side - emitted events
    actions: string[] //left side - actions to take
}>

export default function BlockFlowNode(props: NodeProps<BlockFlowNodeProps>) {
    return (
        <div>
            <div className={"p-3 bg-gray-200 w-48 h-36 flex text-black text-center rounded-lg "}>
                <div>{props.data.friendly_name}</div>
            </div>
            {props.data.events.map((event) => (
                <Handle type={"source"} position={Position.Right} id={event} key={event}>
                    <div className={"bg-white p-1 rounded-lg text-black"}>{event}</div>
                </Handle>
            ))}
            {props.data.actions.map((action) => (
                <Handle type={"target"} position={Position.Left} id={action} key={action}>
                    <div className={"bg-white p-1 rounded-lg text-black text-sm"}>{action}</div>
                </Handle>
            ))}
        </div>
    )
}