"use client";

import {
    closestCenter,
    DndContext,
    DragEndEvent, DragOverEvent, DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {useEditorStore} from "@/app/component/editor/state/zustand";
import BlockEdit from "@/app/component/editor/editor-components/blocks/block-edit";
import InsertBlockButton from "@/app/component/editor/editor-components/blocks/insert-block-button";
import {useEffect, useState} from "react";
import {flattenBlocks} from "@/app/api/utils/flatten-blocks";
import {Block} from "@/app/types";

type PageContentsProps = {
    page_id: string | null;
}

export default function PageContents(props: PageContentsProps) {
    const {page_id} = props;

    const addRootBlock = useEditorStore((state) => state.addRootBlock);
    const reorderBlock = useEditorStore((state) => state.reorderBlock);
    const [loading, setLoading] = useState<boolean>(true);
    const [overId, setOverId] = useState<string | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);

    const page = useEditorStore(
        (state) => {
            if (page_id) return state.content.pages[page_id]
            return null
        }
    )
    //const [blocks, setBlocks] = useState<Block[]>(page_content);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );


    function handleDragEnd(e: DragEndEvent) {
        const {active, over} = e

        setOverId(null)
        if (!over) return;


        if (active.id !== over.id) {
            reorderBlock(page_id as string, active.id as string, over.id as string); //TODO: fix this pls
        }
        console.log(active.id + " : " + over.id)
    }

    function handleDragOver(e: DragOverEvent) {
        const {over} = e
        if (!over) return
        setOverId(over.id as string) //it's joever
    }

    function handleDragStart(e: DragStartEvent) {
        const {active} = e
        if (!active) return
        setActiveId(active.id as string) //we're so barack
    }

    useEffect(() => {
        if (!page_id || !page) return

        if (Object.keys(page.blocks).length === 0) {
            console.log("root block not found! regenerating...")
            addRootBlock(page_id)
        }
        setLoading(false)
    }, [page, page_id, addRootBlock, setLoading])

    if (!page_id || !page) return null

    if (loading) return <div>loading...</div>

    const flat_blocks = flattenBlocks(page.blocks, (page.blocks["root"].props.children_ids || []).map((id) => page.blocks[id] as Block));

    const activeIndex = flat_blocks.findIndex(b => b.props.id === activeId);
    const overIndex = flat_blocks.findIndex(b => b.props.id === overId);

    return (
        <div className={"p-3 m-5 bg-gray-800 rounded-2xl w-1/2 max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-100  scrollbar-track-gray-700 transition-all"}>
            <DndContext onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDragStart={handleDragStart}
                        sensors={sensors}
                        collisionDetection={closestCenter}>
                <SortableContext items={flat_blocks.map((block) => block.props.id)}
                                 strategy={verticalListSortingStrategy}>
                    {flat_blocks.map((block) => (
                    <div key={block.props.id} className={"relative"}>
                        <BlockEdit block={block} page_id={page_id} overId={overId}
                                   activeIndex={activeIndex} overIndex={overIndex}/>
                    </div>
                    ))}
                </SortableContext>
                {/*<BlockEdit block={page.blocks["root"]} page_id={page_id}/>*/}
                {/*<SortableContext
                    items={
                    //zustand_page?.blocks.map(block => block.props.id)
                        Object.keys(zustand_page.blocks).map((k) => zustand_page.blocks[k].props.id)}
                    strategy={verticalListSortingStrategy}>
                    <div className={"text-center text-xl"}>page contents!!</div>
                    {page.blocks.length < 1 &&
                        <div>empty! oopsies</div>}
                    {page.blocks.map(block => (
                        <BlockEdit block={block} key={block.props.id} page_number={page_id}/>
                    ))}

                </SortableContext>*/}
            </DndContext>
            <InsertBlockButton page_id={page_id}/>
        </div>
    )
}

//i live, i learn

//all hope that was, all hope that is, all hope to be