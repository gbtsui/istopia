"use client";

import {NodeProps, Node} from "@xyflow/react";
import {EngineEventListener} from "@/app/engine";

type BlockFlowNodeProps = Node<{listeners: EngineEventListener}>

export default function BlockFlowNode(props: NodeProps<BlockFlowNodeProps>) {
    return (<></>)
}