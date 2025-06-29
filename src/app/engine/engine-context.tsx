"use client"

import {createContext, ReactNode, useContext} from "react";
import {useEngine, IstopiaEngine} from "@/app/engine";
import {Page} from "@/app/types";

const EngineContext = createContext<ReturnType<IstopiaEngine> | null>(null);

export const EngineProvider = ({children, pages}: {children: ReactNode, pages: Record<string, Page>}) => {
    const engine = useEngine(pages)

    return (
        <EngineContext.Provider value={engine}>
            {children}
        </EngineContext.Provider>
    )
}

export const useEngineContext = () => {
    const context = useContext(EngineContext);
    if (!context) {
        throw new Error("useEngineContext must be used within an EngineProvider");
    }
    return context;
}