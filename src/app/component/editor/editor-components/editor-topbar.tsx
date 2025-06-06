"use client"

type EditorTopBarProps = {
    currentPage: number,
    totalPages: number,
    setCurrentPage: (page_number: number) => void
    lastSaved: Date,
    setLastSaved: (lastSaved: Date) => void
}

export default function EditorTopBar(props: EditorTopBarProps) {
    const {currentPage, setCurrentPage, totalPages, lastSaved, setLastSaved} = props

    const timeSinceLastSave = Date.now() - lastSaved.getTime()

    return (
        <div className={"w-full h-20 m-3 p-2 rounded-xl bg-white text-black flex flex-row justify-between items-center text-center"}>
            <div className={"text-xl"}>
                <span>Page: </span>{currentPage}<span>/{totalPages}</span>
            </div>
            <div className={"flex flex-col text-center"}>
                <span>Last saved at {}</span>
            </div>
            <div>
                <button onClick={() => alert("publishing is broken vruh")}>Publish</button>
            </div>
        </div>
    )
}