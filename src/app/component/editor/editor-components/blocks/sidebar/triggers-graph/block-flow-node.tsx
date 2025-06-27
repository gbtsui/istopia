"use client";

import {NodeProps, Node} from "@xyflow/react";

type BlockFlowNodeProps = Node<{
    friendly_name: string,
    events: string[], //right side - emitted events
    actions: string[] //left side - actions to take
}>

export default function BlockFlowNode(props: NodeProps<BlockFlowNodeProps>) {
    return (
        <div>

        </div>
    )
}