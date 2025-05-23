"use client";

import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {ReactNode} from "react";

export type SortableProps = {
    children?: ReactNode;
    content: string,
    className?: string,
    id: string,
}

export default function Sortable(props: SortableProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({id: props.id})

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    return (
        <div ref={setNodeRef} style={style} className={props.className} {...attributes}>
            <div {...listeners}>
                handle
            </div>
            <p>{props.content}</p>
            {props.children}
        </div>
    )
}