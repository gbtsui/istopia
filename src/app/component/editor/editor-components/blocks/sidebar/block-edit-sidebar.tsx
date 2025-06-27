"use client";

import {useEditorStateStore} from "@/app/component/editor/state/zustand";

export default function BlockEditSidebar() {
    const selected_block = useEditorStateStore((state) => state.selected_block);

    if (!selected_block) {
        return null;
    }

    return (
        <div className={"w-1/2 p-3 m-5 bg-gray-800 rounded-2xl"}>
            edit sidebar
        </div>
    )
}