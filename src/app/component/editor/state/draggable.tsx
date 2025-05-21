"use client";

import {useDraggable} from "@dnd-kit/core";
import {ReactNode} from "react";

export type DraggableProps = {
    children: ReactNode;
}

export default function Draggable(props: DraggableProps) {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: 'draggable',
    });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;


    return (
        <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {props.children}
        </button>
    );
}