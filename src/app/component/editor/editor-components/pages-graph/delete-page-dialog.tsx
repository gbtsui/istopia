"use client";

type DeletePageDialogProps = {
    visible: boolean,
    handleResponse: (arg: boolean) => void, //yaaargh swab the poop deck
}

export default function DeletePageDialog(props: DeletePageDialogProps) {
    if (!props.visible) return null;
    return (
        <div className={"fixed inset-0 items-center justify-center flex z-50 w-full h-full bg-black/75 text-white backdrop-blur-md"}>
            <div className={"w-1/2 m-3 p-3 bg-gray-700 rounded-2xl"}>
                <div className={"text-center text-2xl"}>delete page?</div>
                <p>are you sure you want to delete this page? you can't undo this operation!</p>
                <div className={"flex justify-evenly"}>
                    <button onClick={() => props.handleResponse(false)} className={"p-3 bg-black text-white rounded-xl"}>cancel</button>
                    <button onClick={() => props.handleResponse(true)} className={"p-3 bg-red-500 text-white rounded-xl"}>delete</button>
                </div>
            </div>
        </div>
    )
}