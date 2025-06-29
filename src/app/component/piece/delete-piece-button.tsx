"use client";

import {PieceMetaData} from "@/app/types";
import {useEffect, useState} from "react";
import DeletePiece from "@/app/api/data/pieces/delete-piece";
import {useRouter} from "next/navigation";

type DeletePieceButtonProps = {
    piece_id: string;
    slug: string;
    username: string;
}

export default function DeletePieceButton(props: DeletePieceButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [checked, setIsChecked] = useState(false);
    const [twoFAValue, setTwoFAValue] = useState("");
    const [canDelete, setCanDelete] = useState(false);
    const [loading, setLoading] = useState(false);

    const text = `DELETE ${props.username}/${props.slug}`
    const router = useRouter();

    useEffect(() => {
        if (checked && twoFAValue === text) setCanDelete(true)
        else setCanDelete(false)
    }, [checked, twoFAValue]);

    const deletePiece = () => {
        const funcThing = async () => {
            setLoading(true);
            const result = await DeletePiece(props.username, props.piece_id)
            if (result.success) {
                await router.push("/dashboard");
            }
        }
        funcThing();
    }


    return (
        <div>
            <button onClick={() => setIsOpen(true)} className={"p-2 material-symbols-outlined bg-black hover:bg-red-500 rounded-md transition-colors"}>delete</button>
            {
                isOpen && <div
                    className={"fixed inset-0 items-center justify-center flex z-50 w-full h-full bg-black/50 backdrop-blur-md"}>
                    <div className={"w-1/2 m-3 p-3 bg-gray-700 rounded-2xl"}>
                        <button onClick={() => setIsOpen(false)} className={"p-4 bg-black rounded-2xl"}>x</button>

                        <div className={"overflow-auto h-60 flex flex-col text-center"}>

                            <div className={"text-xl m-3"}>are you sure??? :(</div>

                            <div className={"mb-5 mt-2"}>
                                your piece will be PERMANENTLY deleted!!!! there's no coming back from this!!!
                            </div>
                            <div>
                                <input type={"checkbox"} checked={checked}
                                       onChange={(e) => setIsChecked(e.target.checked)}/>
                                <label className={"ml-3"}>yes, delete my piece</label>
                            </div>
                            {
                                checked &&
                                <div>
                                    <p>Type "{text}" in the box below</p>
                                    <input type={"text"} value={twoFAValue}
                                           onChange={(e) => setTwoFAValue(e.target.value)}
                                    className={"p-2 bg-white text-black"}/>
                                    <div>
                                        <button disabled={!canDelete}
                                                className={"p-3 text-xl text-white bg-red-500 disabled:bg-red-200 disabled:text-black transition-all rounded-xl"}
                                                onClick={deletePiece}>
                                            delete.
                                        </button>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            }
            {
                loading &&
                <div
                    className={"fixed inset-0 items-center justify-center flex z-50 w-full h-full bg-black/50 backdrop-blur-md"}>
                    <div className={"w-1/2 m-3 p-3 bg-gray-700 rounded-2xl"}>
                        <div className={"overflow-auto h-60 flex flex-wrap text-xl text-center"}>
                            <p className={"m-3"}>deleting...</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}