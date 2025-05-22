"use client";

import {useEffect, useState} from "react";

export default function CreatePieceForm({createAction}: { createAction: (e: FormData) => Promise<void | Error> }) {
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
        <div>
            {
                loading ?
                    <div className={"text-center text-2xl text-gray-600"}>
                        loading...
                    </div>
                    :
                    <form action={action}>
                        <div>
                            <label>piece title</label><br/>
                            <input type="text" placeholder={"title"}/>
                        </div>
                        <div>
                            <label>piece description</label><br/>
                            <textarea placeholder={"summary"}/>
                        </div>
                    </form>
            }
            {
                error &&
                <div>
                    error! {error}
                </div>
            }
        </div>
    )

}