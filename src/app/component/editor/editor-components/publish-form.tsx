"use client";

import {useEditorMetaDataStore, useEditorStore} from "@/app/component/editor/state/zustand";
import {useState} from "react";
import {redirect} from "next/navigation";
import UpdatePieceMetaData from "@/app/api/data/pieces/update-piece-metadata";

export function PublishButton() {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    return (
        <div>
            <button onClick={() => setDialogIsOpen(true)} className={"bg-gray-800 text-white p-5 m-4 text-2xl rounded-3xl"}>
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
    const [loading, setLoading] = useState(false);

    const {piece_id, author_id, author_name, title, slug, summary, published} = useEditorMetaDataStore()

    const form_action = (formData: FormData) => {
        const save_to_db = async () => {
            setLoading(true);
            await UpdatePieceMetaData({
                username: author_name,
                piece_id,
                metadata: {
                    title: formData.get("title") as string,
                    slug: formData.get("slug") as string,
                    summary: formData.get("summary") as string
                }
            });
            publishContent(
                author_name,
                piece_id,
            ).then((result) => {
                result.success && redirect(`/u/${author_name}/${slug}`)
            })
        }
        save_to_db().then(() => console.log("formed actioned"))
    }

    if (!dialogIsOpen) return null;

    return (
        <div className={"fixed inset-0 items-center justify-center flex z-50 w-full h-full bg-black/75 backdrop-blur-md"}>
            <div className={"w-3/4 m-3 p-3 bg-gray-700 rounded-2xl"}>
                <button onClick={() => setDialogIsOpen(false)} className={"p-4 bg-black rounded-2xl"}>x</button>
                <div>
                    <form action={form_action}>
                        <div>
                            <span>Title</span><br/>
                            <input type={"text"} name={"title"} className={"p-3 bg-gray-600 rounded-xl"} defaultValue={title} onChange={() => {}}/>
                        </div>
                        <div>
                            <span>Slug</span><br/>
                            <span>https://istopia.vercel.app{/*TODO: change to actual canonical url*/}/u/{author_name}/
                                <input type={"text"} defaultValue={slug} name={"slug"} onChange={() => {}}/>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}