"use client";
import {useState} from "react";

export interface EngineEvent {
    event: string; //ex. typingComplete, buttonClicked
    triggering_block_id: string; //what block triggered the event?
}

export interface EventListener {
    self_block_id: string; //what block is listening?
    target_block_id: string; //what block are you listening to?
    target_event: string; //what event are you listening to?
    action: string; //what action will the listener trigger?
}

export const useEngine = (setBlock: (id: string) => void) => {
    const [state, setState] = useState<Record<string, any>>({});
    const [listeners, setListeners] = useState<Array<EventListener>>([]);

    const handleEvent = (event: EngineEvent)=> {

    }

    const listen = (listener: EventListener) => {
        setListeners([...listeners, listener]);
    }

    const unlisten = (listener: EventListener) => {
        const newListeners = listeners.filter(l => l !== listener);
        setListeners(newListeners);
    }

    return {handleEvent, state, listen, unlisten};
}