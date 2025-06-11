"use client";

import {Background, Controls, ReactFlow} from "@xyflow/react";
import '@xyflow/react/dist/style.css';

export default function PagesGraph() {
    return (
        <div className={"h-dvh w-full"}>
            <ReactFlow>
                <Background/>
                <Controls/>
            </ReactFlow>
        </div>
    )
}