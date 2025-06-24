"use client";

import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {CSSProperties, ReactNode} from "react";
import {BlockProps} from "@/app/types";

export type SortableProps = {
    children?: ReactNode;
    content: string,
    className?: string,
    id: string,
    left_margin?: number,
    is_collapsed?: boolean,
    has_children?: boolean,
    updateProps: (newProps: Partial<BlockProps>) => void
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
                {
                    ((!props.has_children) || (props.is_collapsed)) &&
                    <div className={"material-symbols-outlined select-none cursor-grab"} {...listeners}>
                        menu
                    </div>
                }
                {props.has_children && (
                    <button
                        onClick={() => props.updateProps({ is_collapsed: !props.is_collapsed || false})}
                        className="text-xs p-1 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        {props.is_collapsed ? "▶" : "▼"}
                    </button>
                )}
                <p>{props.content}</p>
            </div>

            {props.children}
        </div>
    )
}