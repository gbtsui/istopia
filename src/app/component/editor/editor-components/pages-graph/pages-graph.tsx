"use client";

import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    Controls, OnBeforeDelete, OnConnect, OnEdgesChange, OnNodesChange,
    ReactFlow,
    useStoreApi,
} from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import {PageNodeData, PageNodeEdge} from "@/app/types";
import {useEditorStore} from "@/app/component/editor/state/zustand";
import {useCallback, useEffect, useState} from "react";
import PageFlowNode from "@/app/component/editor/editor-components/pages-graph/page-node";
import DeletePageDialog from "@/app/component/editor/editor-components/pages-graph/delete-page-dialog";

const nodeTypes = {
    pageNode: PageFlowNode
}

export default function PagesGraph() {
    const store = useStoreApi()

    //const editorStore = useEditorStore()
    const editPage = useEditorStore((state) => state.editPage)
    const deletePage = useEditorStore((state) => state.deletePage)
    const pages = useEditorStore((state) => state.content.pages)
    const setPageCoordinates = useEditorStore((state) => state.setPageCoordinates)

    const [page_nodes, setPageNodes] = useState<PageNodeData[]>([]);
    const [edges, setEdges] = useState<PageNodeEdge[]>([]);
    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
    const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

    const update_nodes = useCallback(() => {
        if (!Object.keys(pages).length) return

        const pages_list = Object.entries(pages).map(([, v]) => v)
        const nodes = pages_list.map((page) => {
            return page.flow_node_data;
        })
        const edges = pages_list.map((page) => {
            return page.outward_connections.map((outwardConnection) => {
                return {
                    id: `${page.id}-${outwardConnection}`,
                    source: page.id,
                    target: outwardConnection
                } as PageNodeEdge
            })
        }).flat()
        setEdges(edges)
        setPageNodes(nodes)
    }, [pages])


    useEffect(() => {
        console.log("useEffect running")
        update_nodes()
    }, [pages, update_nodes])


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
            page_nodes.length === 0,
            {
                x: centerX, y: centerY
            }
        );

        update_nodes()
        //console.log(updated_nodes)
    }, [addPage, store, update_nodes, page_nodes.length])

    const onNodesChange: OnNodesChange = useCallback(
        (changes) => {
            changes.forEach((change) => {
                if (change.type === "position") {
                    const page_id = change.id;
                    const new_position = change.position;
                    setPageCoordinates(page_id, {
                        x: new_position?.x as number,
                        y: new_position?.y as number
                    })
                }
            })
            setPageNodes((nds) => applyNodeChanges(changes, nds))
        }, [setPageNodes, setPageCoordinates]);

    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges],
    );

    const onConnect: OnConnect = useCallback(
        (change) => {
            const source = {...pages}[change.source]
            if (!source) return setEdges((eds) => addEdge(change, eds))
            source.outward_connections.push(change.target)
            pages[change.source] = source
            setEdges((eds) => addEdge(change, eds))
        },
        [setEdges, pages],
    );

    const confirmDelete: () => Promise<boolean> = async () => {
        setDeleteDialogIsOpen(true);
        return new Promise<boolean>((resolve) => {
            setResolver(() => resolve)
        })
    }

    const handleResponse = (arg: boolean) => {
        if (resolver) {
            resolver(arg);
            setResolver(null);
        }
        setDeleteDialogIsOpen(false)
    }

    const onBeforeDelete: OnBeforeDelete = useCallback(
        async (change: { nodes: PageNodeData[], edges: PageNodeEdge[] }): Promise<false | {
            nodes: PageNodeData[],
            edges: PageNodeEdge[]
        }> => {
            const confirmed = await confirmDelete()
            if (!confirmed) return false;

            const {nodes, edges} = change
            edges.forEach((edge) => {
                const sourcePage = pages[edge.source]
                sourcePage.outward_connections = sourcePage.outward_connections.filter((outwardConnection) => outwardConnection !== edge.target)
                editPage(edge.source, sourcePage)
            })
            nodes.forEach((node) => {
                deletePage(node.id)
            })
            return change
        },
        [editPage, pages, deletePage, confirmDelete],
    )

    return (
        <div className={"w-full h-full"}>
            <ReactFlow proOptions={{hideAttribution: true}}
                       nodeTypes={nodeTypes}
                       nodes={page_nodes}
                       edges={edges}
                       onNodesChange={onNodesChange}
                       onEdgesChange={onEdgesChange}
                       onConnect={onConnect}
                       onBeforeDelete={onBeforeDelete}
            >
                <Background/>
                <Controls/>
            </ReactFlow>
            <div className={"fixed right-0 bottom-0"}>
                <button onClick={onClick}
                        className={"p-3 m-3 bg-white text-black rounded-2xl text-2xl hover:cursor-pointer"}>
                    + Add Page
                </button>
            </div>
            <DeletePageDialog visible={deleteDialogIsOpen} handleResponse={handleResponse}/>
        </div>
    )
}