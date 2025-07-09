"use client"

import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import {Block, BlockNodeData, BlockNodeEdge, BlockProps, Page} from "@/app/types";
import {useEditorStateStore, useEditorStore} from "@/app/component/editor/state/zustand";
import {EngineEventListener} from "@/app/engine";

export const TriggersGraphContext = createContext<TriggersGraphType | null>(null);

export type TriggersGraphType = {
    currentPageId: string | null | undefined,
    pages: Record<string, Page>,
    currentPage: Page | null,
    editPage: (page_id: string, new_data: Partial<Page>) => void,
    editBlock: (page_id: string, block_id: string, new_props: BlockProps) => void,
    blocks: Record<string, Block>,
    blockNodes: BlockNodeData[],
    setBlockNodes: Dispatch<SetStateAction<BlockNodeData[]>>,
    edges: BlockNodeEdge[],
    setEdges: Dispatch<SetStateAction<BlockNodeEdge[]>>,
    selectedEdge: EngineEventListener | null,
    setSelectedEdge: Dispatch<SetStateAction<EngineEventListener | null>>
}

export const TriggersGraphProvider = ({children}: { children: ReactNode }) => {
    const currentPageId = useEditorStateStore((state) => state.current_page)
    const pages = useEditorStore((state) => state.content.pages)
    const currentPage = currentPageId ? pages[currentPageId] : null
    const editPage = useEditorStore((state) => state.editPage)
    const editBlock = useEditorStore((state) => state.editBlock)
    const blocks = (currentPage && currentPage.blocks) ?? {}; //i love learning combinations of logic operators :D
    const [selectedEdge, setSelectedEdge] = useState<EngineEventListener|null>(null)

    const [blockNodes, setBlockNodes] = useState<BlockNodeData[]>([]);
    const [edges, setEdges] = useState<BlockNodeEdge[]>([]); //according to the Consensus Of The Fathers edging is not beneficial

    const new_edges = useMemo(() => {
        return Array.from(
            new Map(
                Object.values(blocks)
                    .flatMap((block) =>
                        block.props.listeners.map((listener) => {
                            const edgeId = `${listener.target_block_id}-${listener.target_event}.${listener.action}-${listener.self_block_id}`;
                            return [
                                edgeId,
                                {
                                    id: edgeId,
                                    source: listener.target_block_id,
                                    sourceHandle: listener.target_event.split(":")[1],
                                    target: listener.self_block_id,
                                    targetHandle: listener.action,
                                    type: "listenerEdge",
                                    data: { listener }
                                }
                            ];
                        })
                    )
            ).values()
        );
    }, [blocks]);

    const blockNodesArray = useMemo(() => {
        return Object.values(currentPage?.blockNodes || {});
    }, [currentPage?.blockNodes]);

    const arraysAreEqual = (a: any[], b: any[]) => {
        if (a.length !== b.length) return false;
        return a.every((val, index) => val.id === b[index].id);
    };

    useEffect(() => {
        setEdges((prev) =>
            arraysAreEqual(prev, new_edges) ? prev : new_edges
        );
        setBlockNodes((prev) =>
            arraysAreEqual(prev, blockNodesArray) ? prev : blockNodesArray
        );
    }, [new_edges, blockNodesArray]);

    return (
        <TriggersGraphContext.Provider value={{
            currentPageId,
            pages,
            currentPage,
            editPage,
            editBlock,
            blocks,
            blockNodes,
            setBlockNodes,
            edges,
            setEdges,
            selectedEdge,
            setSelectedEdge,
        }}>
            {children}
        </TriggersGraphContext.Provider>)
}

export const useTriggersGraph = () => {
    const context = useContext(TriggersGraphContext)
    if (!context) {
        throw new Error("useTriggersGraph must be used within a TriggersGraphProvider");
    }
    return context;
}
