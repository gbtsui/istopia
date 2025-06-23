"use client";

import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {CSSProperties, ReactNode} from "react";

export type SortableProps = {
    children?: ReactNode;
    content: string,
    className?: string,
    id: string,
    left_margin?: number,
}

export default function Sortable(props: SortableProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({id: props.id})

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        marginLeft: props.left_margin && `calc(${props.left_margin} * 1rem)`,
    }

    return (
        <div ref={setNodeRef} style={style} className={props.className} {...attributes}>
            <div className={"flex gap-5 flex-row w-full"}>
                <div className={"material-symbols-outlined select-none cursor-grab"} {...listeners}>
                    menu
                </div>
                <p>{props.content}</p>
            </div>

            {props.children}
        </div>
    )
}