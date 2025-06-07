"use client";

import {useEditorMetaDataStore, useEditorStore} from "@/app/component/editor/state/zustand";
import {useState} from "react";

export function PublishButton() {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    return (
        <div className={"fixed"}>
            <button onClick={() => setDialogIsOpen(true)} className={"p-5 m-4 text-2xl bg-white text-black rounded-3xl"}>
                Publish
            </button>
            <PublishForm setDialogIsOpen={setDialogIsOpen} dialogIsOpen={dialogIsOpen} />
        </div>
    )
}

type PublishFormProps = {
    dialogIsOpen: boolean;
    setDialogIsOpen: (open: boolean) => void;
}

function PublishForm(props: PublishFormProps) {
    const {dialogIsOpen, setDialogIsOpen} = props
    const publishContent = useEditorStore((state) => state.publishContent);

    const {piece_id, author_id, author_name, title, slug, summary, published} = useEditorMetaDataStore()

    const form_action = (formData: FormData) => {

    }

    if (!dialogIsOpen) return null;

    return (
        <div className={"fixed inset-0 items-center justify-center flex z-50 w-full h-full bg-black backdrop-opacity-50"}>
            <div className={"w-3/4 m-3 p-3 bg-gray-700 rounded-2xl"}>
                <button onClick={() => setDialogIsOpen(false)} className={"p-4 bg-black rounded-2xl"}>x</button>
                <div>
                    <form action={form_action}>
                        <div>
                            <span>Title</span><br/>
                            <input type={"text"} name={"title"} className={"p-3 bg-gray-600 rounded-xl"}/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}