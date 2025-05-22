"use client";

import {useEffect, useState} from "react";

export default function CreatePieceForm({createAction, redirAction}: { createAction: (e: FormData) => Promise<void | Error> , redirAction: (slug: string) => Promise<void> }) {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        setLoading(false);
    })

    function action(e: FormData) {
        const runTheThingy = async () => {
            setLoading(true);
            const result = await createAction(e)
            if (result instanceof Error) {
                setError(result.message)
            }
            setLoading(false)
        }
        runTheThingy().then(() => console.log("client side action complete :3"));
    }

    return (
        <div className={"m-5 p-3 bg-gray-800 rounded-xl"}>
            {
                loading ?
                    <div className={"text-center text-2xl text-gray-600"}>
                        loading...
                    </div>
                    :
                    <form action={action} className={"flex flex-wrap"}>
                        <div className={"w-1/2 m-3"}>
                            <label>title</label><br/>
                            <input type="text" name="title" placeholder={"title"} className={"p-0.5 bg-gray-700 rounded-lg w-full"}/>
                        </div>
                        <div className={"w-1/2 m-3"}>
                            <label>summary</label><br/>
                            <textarea
                                placeholder={"summary (optional, it's okay if you don't know what it's about yet)"}
                                name={"summary"}
                                className={"p-0.5 bg-gray-700 rounded-lg w-full h-full"}/>
                        </div>
                        <div className={"m-3"}>
                            <button className={"bg-gray-700 p-5 text-xl rounded-xl justify-self-center"}>create!</button>
                        </div>
                    </form>
            }
            {
                error &&
                <div>
                    error! {error}
                </div>
            }
            <button onClick={() => redirAction("98023692-3171-423f-a9ef-a56aeb9fb53e")}>redirect me</button>
        </div>
    )

}