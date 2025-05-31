"use client";
import {useState} from "react";

export interface EngineEvent {
    event: {
        name: string; //ex. typingComplete, buttonClicked
        value: any; //ex. the contents of a textbox
    };
    triggering_block_id: string; //what block triggered the event?
}

export interface EventListener {
    self_block_id: string; //what block is listening?
    target_block_id: string; //what block are you listening to?
    target_event: string; //what event are you listening to?
    action: string; //what action will the listener trigger?
    conditions: Condition[]
}

export interface Condition {
    type: "flag" | "variable";
    key: string;
    operator: "==" | "!=" | ">" | "<";
    side_1: any,
    side_2: any,
}

export interface ExternalValueRef {
    target_block_id: string;
    target_value: any;
}

export type IstopiaEngine = (setBlock: (id: string) => void) => {
    handleEvent: (event: EngineEvent) => void;
    listen: (listener: EventListener) => void;
    unlisten: (listener: EventListener) => void;
    getBlockValue: (ref: ExternalValueRef) => any;
    setBlockValue: (ref: ExternalValueRef) => void;
}

export const useEngine: IstopiaEngine = (setBlock: (id: string) => void) => {
    const [state, setState] = useState<Record<string, any>>({});
    const [listeners, setListeners] = useState<Array<EventListener>>([]); //array of all listeners
    const [blockValues, setBlockValues] = useState<Array<Record<string, any>>>([]); //array of all blockValues

    const handleEvent = (event: EngineEvent)=> {

    }

    const listen = (listener: EventListener) => {
        setListeners([...listeners, listener]);
    }

    const unlisten = (listener: EventListener) => {
        const newListeners = listeners.filter(l => l !== listener);
        setListeners(newListeners);
    }

    const getBlockValue = (ref: ExternalValueRef) => {

    }

    const setBlockValue = (ref: ExternalValueRef) => {

    }

    return {handleEvent, state, listen, unlisten, getBlockValue, setBlockValue};
}