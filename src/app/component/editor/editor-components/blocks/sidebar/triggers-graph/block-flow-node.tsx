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
            <div>{props.data.friendly_name}</div>
            {props.data.events.map((event) => (
                <Handle type={"source"} position={Position.Right} id={event} key={event}>
                    <div className={"handletext"}>{event}</div>
                </Handle>
            ))}
            {props.data.actions.map((action) => (
                <Handle type={"target"} position={Position.Left} id={action} key={action}>
                    <div className={"handletext"}>{action}</div>
                </Handle>
                ))}
        </div>
    )
}