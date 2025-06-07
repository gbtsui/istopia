"use client";

import {useEditorMetaDataStore, useEditorStore} from "@/app/component/editor/state/zustand";
import {useEffect, useState} from "react";
import {redirect} from "next/navigation";
import UpdatePieceMetaData from "@/app/api/data/pieces/update-piece-metadata";

export function PublishButton() {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    return (
        <div>
            <button onClick={() => setDialogIsOpen(true)}
                    className={"bg-gray-800 text-white p-5 m-4 text-2xl rounded-3xl"}>
                Publish
            </button>
            <PublishForm setDialogIsOpen={setDialogIsOpen} dialogIsOpen={dialogIsOpen}/>
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

    const {piece_id, author_id, author_name, title, slug, summary, published, setData} = useEditorMetaDataStore()

    const [enteredTitle, setEnteredTitle] = useState<string>(title);
    const [enteredSummary, setEnteredSummary] = useState<string>(summary)
    const [enteredSlug, setEnteredSlug] = useState<string>(slug);

    useEffect(() => {
        setEnteredTitle(title);
        setEnteredSummary(summary);
        setEnteredSlug(slug);
    }, [dialogIsOpen])

    const publish = () => {
        const save_to_db = async () => {
            setLoading(true);
            await UpdatePieceMetaData({
                username: author_name,
                piece_id,
                metadata: {
                    title: enteredTitle,
                    slug: enteredSlug,
                    summary: enteredSummary,
                }
            });
            publishContent(
                author_name,
                piece_id,
            ).then((result) => {
                result.success && redirect(`/u/${author_name}/${enteredSlug}`)
            })
        }
        save_to_db().then(() => console.log("formed actioned"))
    }

    if (!dialogIsOpen) return null;

    return (
        <div
            className={"fixed inset-0 items-center justify-center flex z-50 w-full h-full bg-black/75 text-white backdrop-blur-md"}>
            <div className={"w-3/4 m-3 p-3 bg-gray-700 rounded-2xl"}>
                <div className={"w-full flex"}>
                    <button onClick={() => setDialogIsOpen(false)}
                            className={"p-2 bg-black text-white h-10 w-10 text-center items-center rounded-2xl justify-self-end"}>x
                    </button>
                </div>
                <div className={"flex flex-col gap-5 space-y-6"}>
                    <span className={"text-2xl"}>finalize and publish</span>
                    <div className={"text-right flex flex-row items-center justify-evenly gap-3"}>
                        <div className={"space-y-4"}>
                            <p>Title</p>
                            <span className={"mt-0 p-3 bg-gray-600 text-gray-200 rounded-xl"}>
                                    <input type={"text"} name={"title"} className={"bg-gray-500 rounded-md"}
                                           value={enteredTitle} onChange={(e) => {
                                        setEnteredTitle(e.target.value)
                                    }}/></span>
                        </div>
                        <div className={"space-y-4"}>
                            <p>Slug</p>
                            <span
                                className={"mt-0 p-3 bg-gray-600 text-gray-200 rounded-xl"}>https://istopia.vercel.app{/*TODO: change to actual canonical url*/}/u/{author_name}/
                                    <input type={"text"} className={"bg-gray-500 rounded-md"} value={enteredSlug}
                                           name={"slug"}
                                           onChange={(e) => {
                                               setEnteredSlug(e.target.value
                                                   .toLowerCase()
                                                   .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
                                                   .replace(/\s+/g, "-")        // collapse whitespace
                                                   .replace(/-+/g, "-"))        // collapse dashes
                                           }}/>
                                </span>
                        </div>
                    </div>
                    <div className={"w-full"}>
                        <p>Summary</p>
                        <textarea name={"summary"} rows={10} className={"bg-gray-500 w-3/4 rounded-md resize-none w-full"}
                                  value={enteredSummary} onChange={(e) => {
                            setEnteredSummary(e.target.value)
                        }}/>
                    </div>
                    <button onClick={publish} disabled={loading} className={"bg-black text-xl rounded-2xl p-5"}>Publish!</button>
                </div>
            </div>
        </div>
    )
}
