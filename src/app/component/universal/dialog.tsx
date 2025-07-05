"use client";

import {ReactNode} from "react";

type CustomDialogProps = {
    children?: ReactNode;
    visible: boolean;
    //handleClose: () => void;
}

export default function Dialog(props: CustomDialogProps) {
    if (!props.visible) return null;
    return (
        <div
            className={"fixed inset-0 items-center justify-center flex z-50 w-full h-full bg-black/75 text-white backdrop-blur-md"}>
            <div className={"w-1/2 m-3 p-3 bg-gray-700 rounded-2xl"}>
                {props.children}
            </div>
        </div>
    )
}