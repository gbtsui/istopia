"use client"

import {createContext, ReactNode, useContext} from "react";
import {useEngine, IstopiaEngine} from "@/app/engine";

const EngineContext = createContext<ReturnType<IstopiaEngine> | null>(null);

export const EngineProvider = ({children}: {children: ReactNode}) => {
    const engine = useEngine(() => {})

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