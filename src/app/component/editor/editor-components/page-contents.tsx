"use client";

import {Block} from "@/app/types";
import {useState} from "react";
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
import {EditorStore} from "@/app/component/editor/state/zustand";

type PageContentsProps = {
    page_number: number;
    editor_store: EditorStore;
}

export default function PageContents(props: PageContentsProps) {
    const {page_number, editor_store} = props;

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
            const current_page = editor_store.content.pages[editor_store.content.pages.findIndex(page => page.page_number === page_number)]
            editor_store.reorderBlock(page_number, active.id as string, current_page.blocks.findIndex(block => block.id === over.id));
        }
    }

    return (
        <DndContext onDragEnd={handleDragEnd} sensors={sensors} collisionDetection={closestCenter}>
            <SortableContext items={editor_store.content.pages[editor_store.content.pages.findIndex(page => page.page_number === page_number)].blocks} strategy={verticalListSortingStrategy}>
                <div>page contents!!</div>
                {editor_store.content.pages[editor_store.content.pages.findIndex(page => page.page_number === page_number)].blocks.length < 1 &&
                <div>empty! oopsies</div>}
                {editor_store.content.pages[editor_store.content.pages.findIndex(page => page.page_number === page_number)].blocks.map(block => (
                    <div>
                        Block!<br/>
                        {block.props.content?.map(str => <p>{str}</p>)}
                    </div>
                ))}
            </SortableContext>
        </DndContext>
    )
}