"use client";

import {
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    Controls, OnEdgesChange, OnNodesChange,
    ReactFlow,
    useReactFlow,
    useStoreApi,
    useViewport
} from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import {Page, PageNode} from "@/app/types";
import {useEditorStore} from "@/app/component/editor/state/zustand";
import {useCallback, useEffect, useState} from "react";


export default function PagesGraph() {
    const store = useStoreApi()
    //console.log(page_list);

    const editorStore = useEditorStore()
    const {pages} = editorStore.content
    const [page_nodes, setPageNodes] = useState<PageNode[]>([])

    const page_list = Object.entries(pages).map(([, v]) => v) //weird how doing [,v] actually works haha
    const page_connections: Array<{ id: string, source: string, target: string }> = page_list.map((page) => {
        return page.outward_connections.map((outwardConnection) => {
            return {id: `${page.id}-${outwardConnection}`, source: page.id, target: outwardConnection}
        })
    }).flat()
    //console.log(page_nodes);

    const update_nodes = () => {
        const pages_list = Object.entries(pages).map(([, v]) => v)
        const nodes = pages_list.map((page) => {
            return page.flow_node_data;
        })
        setPageNodes(nodes)
    }


    useEffect(() => {
        console.log("useEffect running")
        update_nodes()
    }, [editorStore.content.pages])


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

        addPage(
            page_list.length === 0,
            {
                x: centerX, y: centerY
            }
        );
        console.log("button pressed")

        update_nodes()
        //console.log(updated_nodes)
    }, [addPage, store, update_nodes, page_list.length])

    const onNodesChange: OnNodesChange = useCallback(
        (changes) => {
            changes.forEach((change) => {
                if (change.type === "position") {
                    const page_id = change.id;
                    const new_position = change.position;
                    editorStore.setPageCoordinates(page_id, {
                        x: new_position?.x as number,
                        y: new_position?.y as number
                    })
                }
            })
            setPageNodes((nds) => applyNodeChanges(changes, nds))
        }, []);

/*const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
);*/

return (
    <div className={"w-full h-full"}>
        <ReactFlow proOptions={{hideAttribution: true}} nodes={page_nodes} onNodesChange={onNodesChange}>
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