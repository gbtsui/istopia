"use client";

import {Handle, Node, NodeProps, Position} from "@xyflow/react";

type BlockFlowNodeProps = Node<{
    friendly_name: string,
    events: string[], //right side - emitted events
    actions: string[] //left side - actions to take
}>

export default function BlockFlowNode(props: NodeProps<BlockFlowNodeProps>) {
    return (
        <div className={"flex flex-row relative"}>
            <div className={"flex flex-col h-full absolute justify-evenly gap-2 p-2 bg-white left-0 top-0 grow"}>
                {props.data.actions.map((action) => (
                    <div key={action}>
                        <Handle type={"target"} position={Position.Left} id={action}
                                className={"relative transform-none top-auto"}/>
                        <p>{action}</p>
                    </div>
                ))}
            </div>

            <div className={"p-3 bg-gray-200 flex text-black text-center grow rounded-lg"}>
                <div>{props.data.friendly_name}</div>
            </div>

            <div className={"flex flex-col h-full absolute justify-evenly gap-2 p-2 bg-white right-0 top-0"}>
                {props.data.events.map((event, index) => (
                    <div key={event} className={"items-end"}>
                        <Handle type={"source"} position={Position.Right} id={event}
                                className={"relative transform-none top-auto"}
                                style={{top: index * 10}}/>
                        <p>{event}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}