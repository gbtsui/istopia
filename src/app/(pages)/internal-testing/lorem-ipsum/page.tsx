/*
"use client";

//what is lorem ipsum?
//it's text.
//obviously.
//but it doesn't mean anything.
//just a placeholder.
//its original meaning scrambled and lost.
//what if that happens to something else?


import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable";
//import Draggable from "@/app/component/editor/state/draggable";
//import Droppable from "@/app/component/editor/state/droppable";
import {useState} from "react";
import Sortable from "@/app/component/editor/state/sortable";

export default function LoremIpsumPage() {
    const [items, setItems] = useState(["1", "2", "3"]);
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
            setItems((items) => {
                const oldIndex = items.indexOf(active.id as string);
                const newIndex = items.indexOf(over.id as string);
                return arrayMove(items, oldIndex, newIndex);
            })
        }
    }


    return (
        <DndContext onDragEnd={handleDragEnd} sensors={sensors} collisionDetection={closestCenter}>
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                {items.map((id) => <Sortable className={"p-3 bg-green-800 m-3"} key={id} id={id} content={id}/>)}
            </SortableContext>
        </DndContext>
    )
}
*/

export default async function LoremIpsumPage() {
    return <div>lorem ipsum</div>
}