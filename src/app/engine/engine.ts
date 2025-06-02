"use client";
import {useRef, useState} from "react";

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
    key: string;
    operator: "AND" | "OR" | "NOT" //you can probably recreate every logic gate type with this tbh
    conditions: Array<Condition | LogicalCondition>;
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

const evaluateCondition = (condition: Condition) => {
    switch (condition.operator) {
            case "==": return condition.side_1 == condition.side_2
            case ">": return condition.side_1 > condition.side_2
            case "!=": return condition.side_1 != condition.side_2
            case "<": return condition.side_1 < condition.side_2
            default: return false
        }
}

const checkConditionType = (c: Condition | LogicalCondition) => {
    switch (c.operator){
        case undefined: return null
        case "==": return "condition"
        case ">": return "condition"
        case "!=": return "condition"
        case "<": return "condition"
        case "AND": return "logical"
        case "OR": return "logical"
        case "NOT": return "logical"
    }
}

const isLogicalCondition = (c: Condition | LogicalCondition): c is LogicalCondition => {
    return ["AND", "OR", "NOT"].includes((c as LogicalCondition).operator);
};

const evaluateLogicalCondition = (logicalCondition: LogicalCondition): boolean => {
    switch (logicalCondition.operator) {
        case "AND":
            return logicalCondition.conditions.every(c =>
                isLogicalCondition(c)
                    ? evaluateLogicalCondition(c)
                    : evaluateCondition(c)
            );
        case "OR":
            return logicalCondition.conditions.some(c =>
                isLogicalCondition(c)
                    ? evaluateLogicalCondition(c)
                    : evaluateCondition(c)
            );
        case "NOT":
            if (logicalCondition.conditions.length !== 1) {
                console.warn("NOT operator expects exactly 1 condition");
                return false;
            }
            const c = logicalCondition.conditions[0];
            return !(isLogicalCondition(c)
                ? evaluateLogicalCondition(c)
                : evaluateCondition(c));
        default:
            console.warn("Unknown operator:", logicalCondition.operator);
            return false;
    }
}

export const useEngine: IstopiaEngine = (setBlock: (id: string) => void) => {
    const [state, setState] = useState<Record<string, any>>({});
    const [listeners, setListeners] = useState<Array<EventListener>>([]); //array of all listeners
    const [blockValues, setBlockValues] = useState<Record<string, Record<string, any>>>({}); //this is gross tbh.
    //a record containing all blocks by id
    //which then contains all fields of that block by name
    //aeugh
    //const blockValues = useRef(new Map<string, Map<string, any>>());
    //should use records instead? idk
    const blockHandlers = useRef(new Map<string, (event: EngineEvent) => void>()) //block with id X is listening for events, call this function when a event comes in

    const handleEvent = (event: EngineEvent)=> {
        listeners.forEach((listener) => {
            if (
                listener.target_block_id === event.triggering_block_id
                &&
                listener.target_event === event.event.name
            ) {
                const conditionsMet = listener.logical_conditions.every(logicalCondition => evaluateLogicalCondition(logicalCondition))

                if (conditionsMet) {
                    notifyListener(listener.self_block_id, event)
                }
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
        const {target_block_id, target_value} = ref
        const block = blockValues[target_block_id]
        if (!block) {
            return null
        }
        return block.get(ref.target_value)
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

    return {handleEvent, state, listen, unlisten, getBlockValue, setBlockValue, registerBlock, unregisterBlock};
}