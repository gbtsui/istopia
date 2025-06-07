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

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    return (
        <div className={"w-full h-20 m-3 p-2 rounded-xl bg-white text-black flex flex-row justify-between items-center text-center"}>
            <div className={"text-xl items-center flex-col flex"}>
                <div>
                    <button
                        className={"material-symbols-outlined text p-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition-all"}>draft
                    </button>
                    <span>{currentPage}/{totalPages}</span>
                </div>
                <div>
                    <button className={"material-symbols-outlined"} onClick={prevPage}>arrow_left</button>
                    <button className={"material-symbols-outlined"} onClick={nextPage}>arrow_right</button>
                </div>
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