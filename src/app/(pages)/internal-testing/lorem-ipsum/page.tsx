"use client";

//what is lorem ipsum?
//it's text.
//obviously.
//but it doesn't mean anything.
//just a placeholder.
//its original meaning scrambled and lost.
//what if that happens to something else?


import {DndContext, DragEndEvent, UniqueIdentifier} from "@dnd-kit/core";
import Draggable from "@/app/component/editor/state/draggable";
import Droppable from "@/app/component/editor/state/droppable";
import {useState} from "react";

export default function LoremIpsumPage() {
    const containers = ["a", "b", "c"];
    const [parent, setParent] = useState<UniqueIdentifier | null>(null);
    const draggableMarkup = (
        <Draggable><div className={"p-4 bg-white text-black"}>thou mayest draggeth me</div></Draggable>
    )

    function handleDragEnd(event: DragEndEvent) {
        const {over} = event
        const result = over ? over.id : null
        setParent(result)
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
            {!parent ? draggableMarkup : null}
            {containers.map((id) => (
                // We updated the Droppable component so it would accept an `id`
                // prop and pass it to `useDroppable`
                <Droppable key={id} id={id}>
                    {parent === id ? draggableMarkup : 'Drop here'}
                </Droppable>
            ))}
        </DndContext>
    )
}