"use client";import {useRef, useState} from "react";

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
    //conditions: Condition[] //what conditions are needed to run the event?
    logical_conditions: LogicalCondition[] //what combinations of conditions are needed to run the event?
}

export interface Condition {
    type: "flag" | "variable";
    key: string;
    operator: "==" | "!=" | ">" | "<"; //self-explanatory
    side_1: any, //probably self value
    side_2: any, //external value
}

export interface LogicalCondition {
    operator: "AND" | "OR" | "NOT" //you can probably recreate every logic gate type with this tbh
    conditions: Condition[];
}

export interface ExternalValueRef {
    target_block_id: string; //what block's data are you trying to get?
    target_value: string; //what data field are you trying to get?
}

export type IstopiaEngine = (setBlock: (id: string) => void) => {
    handleEvent: (event: EngineEvent) => void; //what happens when an event occurs?
    listen: (listener: EventListener) => void; //start listening to X event
    unlisten: (listener: EventListener) => void; //stop listening to X event
    getBlockValue: (ref: ExternalValueRef) => any; //get a value from another block
    setBlockValue: (ref: ExternalValueRef) => void; //set a value from another block in the engine (can be from your own block as well)
}

const evaluateConditions = (conditions: Condition[]) => {
    return conditions.every(condition => {
        switch (condition.operator) {
            case "==": return condition.side_1 == condition.side_2
            case ">": return condition.side_1 > condition.side_2
            case "!=": return condition.side_1 != condition.side_2
            case "<": return condition.side_1 < condition.side_2
        }
    })
}

const evaluateLogicalConditions = (logicalConditions: LogicalCondition[]) => {
    return logicalConditions.every(lc => {
        switch (lc.operator) {
            case "AND": return evaluateConditions(lc.conditions)
        }
    })
}

export const useEngine: IstopiaEngine = (setBlock: (id: string) => void) => {
    const [state, setState] = useState<Record<string, any>>({});
    const [listeners, setListeners] = useState<Array<EventListener>>([]); //array of all listeners
    const [blockValues, setBlockValues] = useState<Array<Record<string, any>>>([]); //array of all blockValues
    const blockHandlers = useRef(new Map<string, (event: EngineEvent) => void>()) //block with id X is listening for events, call this function when a event comes in

    const handleEvent = (event: EngineEvent)=> {
        listeners.forEach((listener) => {
            if (
                listener.target_block_id === event.triggering_block_id
                &&
                listener.target_event === event.event.name
            ) {
                const conditionsMet = evaluateConditions(listener.conditions)

                if (conditionsMet)
            }
        })
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

    const notifyListener = (self_block_id: string, event: EngineEvent) => {
        const handler = blockHandlers.current.get(self_block_id)
        if (handler) {
            handler(event) //run the block's event handler!
        }
    }

    const registerBlock = (id: string, handler: (event: EngineEvent) => void)=> {
        blockHandlers.current.set(id, handler);
    }

    const unregisterBlock = (id: string) => {
        blockHandlers.current.delete(id)
    }

    return {handleEvent, state, listen, unlisten, getBlockValue, setBlockValue};
}