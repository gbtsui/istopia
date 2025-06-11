"use client"

import {useEffect, useState} from "react";
import {PublishButton} from "@/app/component/editor/editor-components/publish-form";

type EditorTopBarProps = {
    currentPage: string | null,
    //totalPages: number,
    lastSaved: Date,
    saveThisWrld: () => void,
    saving: boolean
}

const formatTimeSinceLastSave = (timeMs: number): string => {
    const seconds = Math.floor(timeMs / 1000);

    if (seconds < 60) {
        return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }

    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''}`;
};

export default function EditorTopBar(props: EditorTopBarProps) {
    const {currentPage, lastSaved, saving, saveThisWrld} = props

    const [timeSinceLastSave, setTimeSinceLastSave] = useState(() =>
        Date.now() - lastSaved.getTime()
    );

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeSinceLastSave(Date.now() - lastSaved.getTime());
        }, 1000);

        return () => clearInterval(timer);
    }, [lastSaved, saving]);

    const formattedTime = formatTimeSinceLastSave(timeSinceLastSave)

    return (
        <div className={"w-full h-20 m-3 p-2 rounded-xl bg-white text-black flex flex-row justify-between items-center text-center"}>
            <div className={"text-xl items-center flex-col flex"}>
                <div>
                    <button
                        className={"material-symbols-outlined text p-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition-all"}>draft
                    </button>
                    <span>{currentPage}</span>
                </div>
            </div>
            <div className={"flex flex-col text-center items-center justify-center w-1/6"}>
                <button onClick={saveThisWrld} className={"p-3 text-xl bg-gray-700 text-white w-1/3 rounded-xl"}>save</button>
                <span>{saving? <span className={"text-gray-200 text-sm"}>`saving...`</span> :`last saved ${formattedTime} ago`}</span>
            </div>
            <div>
                <PublishButton/>
            </div>
        </div>
    )
}