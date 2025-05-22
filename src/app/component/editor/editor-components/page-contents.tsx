"use client";

import {Block} from "@/app/types";
import {useState} from "react";
import {DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {sortableKeyboardCoordinates} from "@dnd-kit/sortable";

type PageContentsProps = {
    page_content: Block[];
}

export default function PageContents(props: PageContentsProps) {
    const {page_content} = props;

    const [blocks, setBlocks] = useState<Block[]>(page_content);
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
            
        }
    }
}