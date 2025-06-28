"use client";

import {Handle, Node, NodeProps, Position} from "@xyflow/react";

type BlockFlowNodeProps = Node<{
    friendly_name: string,
    events: string[], //right side - emitted events
    actions: string[] //left side - actions to take
}>

export default function BlockFlowNode(props: NodeProps<BlockFlowNodeProps>) {
    return (
        <div className={"flex flex-row-reverse relative w-48 h-36"}>
            <div className={"flex flex-col h-full justify-between absolute text-black"}>
                {props.data.events.map((event, index) => (
                    <div key={event} className={"items-end"}>
                        <Handle type={"source"} position={Position.Right} id={event}
                                className={"relative transform-none top-auto"}/>
                        <div>{event}</div>
                    </div>
            ))}
            </div>
            <div className={"p-3 bg-gray-200 flex text-black text-center rounded-lg "}>
                <div>{props.data.friendly_name}</div>
            </div>
            <div className={"flex flex-col h-full justify-between absolute"}>
                {props.data.actions.map((action) => (
                    <div key={action}>
                        <Handle type={"source"} position={Position.Right} id={action}
                                className={"relative transform-none top-auto"}/>
                        <div>{action}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}