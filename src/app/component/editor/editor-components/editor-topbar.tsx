"use client"

type EditorTopBarProps = {
    currentPage: number,
    setCurrentPage: (page_number: number) => void
    lastSaved: Date,
    setLastSaved: (lastSaved: Date) => void
}

export default function EditorTopBar(props: EditorTopBarProps) {
    const {currentPage, setCurrentPage, lastSaved, setLastSaved} = props

    return (
        <div className={"w-full h-20 m-3 p-2 rounded-xl bg-white text-black flex"}>
            skibidi toilet
        </div>
    )
}