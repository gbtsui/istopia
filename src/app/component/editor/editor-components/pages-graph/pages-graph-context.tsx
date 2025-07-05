"use client";

import {createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useState} from "react";
import {PageNodeData, PageNodeEdge} from "@/app/types";
import {useEditorStore} from "@/app/component/editor/state/zustand";

export const PagesGraphContext = createContext<PagesGraphType | null>(null);
export type PagesGraphType = {
    page_nodes: PageNodeData[];
    setPageNodes: Dispatch<SetStateAction<PageNodeData[]>>;
    edges: PageNodeEdge[];
    setEdges: Dispatch<SetStateAction<PageNodeEdge[]>>;


    pagesIAmAboutToDelete: PageNodeData[];
    setPagesIAmAboutToDelete: Dispatch<SetStateAction<PageNodeData[]>>;
    edgesIAmAboutToDelete: PageNodeEdge[];
    setEdgesIAmAboutToDelete: Dispatch<SetStateAction<PageNodeEdge[]>>;
    deletePageNode: (id: string) => Promise<void>;
    deleteDialogIsOpen: boolean;
    setDeleteDialogIsOpen: Dispatch<SetStateAction<boolean>>;

    resolver: ((value: boolean) => void )| null;
    setResolver: Dispatch<SetStateAction<((value: boolean) => void) | null>>;

    confirmDelete: () => Promise<boolean>
}

export const PagesGraphProvider = ({children}: { children: ReactNode }) => {
    const [page_nodes, setPageNodes] = useState<PageNodeData[]>([]);
    const [pagesIAmAboutToDelete, setPagesIAmAboutToDelete] = useState<PageNodeData[]>([]);
    const [edgesIAmAboutToDelete, setEdgesIAmAboutToDelete] = useState<PageNodeEdge[]>([]);
    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
    const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);
    const [edges, setEdges] = useState<PageNodeEdge[]>([]);

    const deletePage = useEditorStore((state) => state.deletePage)

    const confirmDelete: () => Promise<boolean> = async () => {
        setDeleteDialogIsOpen(true);
        return new Promise<boolean>((resolve) => {
            setResolver(() => resolve)
        })
    }

    const deletePageNode = useCallback(async (id: string) => {
        const page = page_nodes.find((node) => node.id === id)
        if (!page) return
        setPagesIAmAboutToDelete([page])
        const confirmed = await confirmDelete()
        if (!confirmed) return;
        deletePage(page.id)
        setPageNodes((prev) => prev.filter((node) => node.id !== page.id))
        setPagesIAmAboutToDelete([])
    }, [])

    return (
        <PagesGraphContext.Provider value={{
            page_nodes,
            setPageNodes,
            pagesIAmAboutToDelete,
            setPagesIAmAboutToDelete,
            deleteDialogIsOpen,
            setDeleteDialogIsOpen,
            edgesIAmAboutToDelete,
            setEdgesIAmAboutToDelete,
            resolver,
            setResolver,
            edges,
            setEdges,
            deletePageNode,
            confirmDelete
        }}>
            {children}
        </PagesGraphContext.Provider>
    )
}

export const usePagesGraph = (): PagesGraphType => {
    const context = useContext(PagesGraphContext)
    if (!context) {
        throw new Error('usePagesGraph must be used within a PagesGraphProvider')
    }
    return context
}