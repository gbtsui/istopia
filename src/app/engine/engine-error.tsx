"use client";

type EngineErrorComponentProps = {
    err: string
}

export default function EngineErrorComponent(props: EngineErrorComponentProps){
    return (
        <div className={"w-full text-center"}>
            <h1 className={"text-red-500 text-3xl"}>uh oh, an error occurred!</h1>
            <p className={"p-3 m-4 rounded-xl bg-red-700 text-white"}>{props.err}</p>
            <p className={"text-xs w-1/2"}>this is a problem with the way the piece is configured. this shouldn't happen, but it's not on our end unfortunately. if you're absolutely sure that this is an issue with us, shoot us an email at istopia.support@gbtsui.dev and i'll get back to you asap.</p>
        </div>
    )
}