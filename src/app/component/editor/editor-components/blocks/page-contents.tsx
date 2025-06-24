"use client";

import {
    closestCenter,
    DndContext,
    DragEndEvent,
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
import flattenBlocks from "@/app/api/utils/flatten-blocks";

type PageContentsProps = {
    page_id: string|null;
}

export default function PageContents(props: PageContentsProps) {
    const {page_id} = props;

    const addRootBlock = useEditorStore((state) => state.addRootBlock);
    const reorderBlock = useEditorStore((state) => state.reorderBlock);
    const [loading, setLoading] = useState<boolean>(true);

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

        if (!over) return;


        if (active.id !== over.id) {
            //reorderBlock(page_id, active.id as string, over.id); //TODO: fix this pls
        }
        console.log(active.id + " : " + over.id)
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

    const flat_blocks = flattenBlocks(page.blocks);

    return (
        <div className={"p-3 m-5 bg-gray-800 rounded-2xl w-1/2"}>
            <DndContext onDragEnd={handleDragEnd} sensors={sensors} collisionDetection={closestCenter}>
                <SortableContext items={flat_blocks.map((block) => block.props.id)}
                                 strategy={verticalListSortingStrategy}>
                    {flat_blocks.map((block) => <BlockEdit key={block.props.id} block={block} page_id={page_id}/> )}
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