"use client";

import {Background, Controls, ReactFlow, useReactFlow, useStoreApi, useViewport} from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import {Page, PageNode} from "@/app/types";
import {useEditorStore} from "@/app/component/editor/state/zustand";
import {useCallback} from "react";


export default function PagesGraph() {
    const {pages} = useEditorStore((state) => state.content);

    const store = useStoreApi()
    const page_list = Object.entries(pages).map(([,v]) => v) //weird how doing [,v] actually works haha
    const page_nodes: PageNode[] = page_list.map((page) => {
        return page.flow_node_data
    })

    const addPage = useEditorStore((state) => state.addPage)

    const onClick = useCallback(() => {
        // Get the basic info about the viewport
        const {
            height,
            width,
            transform: [transformX, transformY, zoomLevel]
        } = store.getState();
        const zoomMultiplier = 1 / zoomLevel;

        // Figure out the center of the current viewport
        const centerX = -transformX * zoomMultiplier + (width * zoomMultiplier) / 2;
        const centerY =
            -transformY * zoomMultiplier + (height * zoomMultiplier) / 2;

        addPage(page_list.length === 0, {
            x: centerX, y: centerY
        }); console.log("button pressed")

    }, [addPage, store])

    return (
        <div className={"w-full h-full"}>
            <ReactFlow proOptions={{hideAttribution: true}} nodes={page_nodes}>
                <Background/>
                <Controls/>
            </ReactFlow>
            <div className={"fixed right-0 bottom-0"}>
                <button onClick={onClick}
                        className={"p-3 m-3 bg-white text-black rounded-2xl text-2xl hover:cursor-pointer"}>
                    + Add Page
                </button>
            </div>
        </div>
    )
}