"use client";
import {useRef, useState} from "react";
import {Page} from "@/app/types";

export interface EngineEvent {
    event: {
        name: string; //ex. typingComplete, buttonClicked
        value: any; //ex. the contents of a textbox //TODO: we already have the value/argument getting passed just like pass it into the handler
    };
    triggering_block_id: string; //what block triggered the event?
}

export interface EngineEventListener {
    self_block_id: string; //what block is listening?
    target_block_id: string; //what block are you listening to?
    target_event: string; //what event are you listening to?
    action: string; //what action will the listener trigger?
    //conditions: Condition[] //what conditions are needed to run the event?
    logical_conditions: LogicalCondition[]; //what combinations of conditions are needed to run the event?
    arbitrary_argument?: string | number | boolean | null
} //can only listen within a page!!! very important

export interface Condition {
    key: string;
    operator: "==" | "!=" | ">" | "<"; //self-explanatory
    side_1?: any, //probably self value
    side_2?: any, //external value
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

export type EngineVariable = Record<string, any>

export type IstopiaEngine = (pages: Record<string, Page>) => {
    handleEvent: (event: EngineEvent) => void; //what happens when an event occurs?
    listen: (listener: EngineEventListener) => void; //start listening to X event
    unlisten: (listener: EngineEventListener) => void; //stop listening to X event
    getBlockValue: (ref: ExternalValueRef) => any; //get a value from another block
    setBlockValue: (ref: ExternalValueRef, data: any) => void; //set a value from another block in the engine (can be from your own block as well)

    registerBlock: (id: string, handler: (action: string, value:  string | number | boolean | undefined | null) => void) => void;
    unregisterBlock: (id: string) => void;

    currentPage: string;
    setCurrentPage: (new_id: string) => void;
    pages: Record<string, Page>;
}

const evaluateCondition = (condition: Condition) => {
    switch (condition.operator) {
            case "==": return condition.side_1 === condition.side_2
            case ">": return condition.side_1 > condition.side_2
            case "!=": return condition.side_1 !== condition.side_2
            case "<": return condition.side_1 < condition.side_2
            default: return false
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

export const useEngine: IstopiaEngine = (pages: Record<string, Page>) => {
    const listeners = useRef<Array<EngineEventListener>>([]); //array of all listeners
    const blockValues = useRef(<Record<string, Record<string, any>>>({})); //this is gross tbh.
    const blockHandlers = useRef(new Map<string, (action: string, value:  string | number | boolean | undefined | null) => void>()) //block with id X is listening for events, call this function when a event comes in
    const [currentPage, setCurrentPage] = useState<string>("");
    /*const currentPage = useRef<string>("")

    const setCurrentPage = (new_page: string) => {
        currentPage.current = new_page
    }*/


    const handleEvent = (event: EngineEvent)=> {
        console.log("new event just dropped gng")
        console.log(event)
        listeners.current.forEach((listener) => {
            if (
                listener.target_block_id === event.triggering_block_id
                &&
                listener.target_event === event.event.name
            ) {
                const conditionsMet = listener.logical_conditions.every(logicalCondition => evaluateLogicalCondition(logicalCondition))

                if (conditionsMet) {
                    console.log(listener.arbitrary_argument)
                    console.log(event.event.value)
                    if (listener.arbitrary_argument !== undefined) {
                        notifyListener(listener.self_block_id, listener.action, listener.arbitrary_argument)
                    } else {
                        notifyListener(listener.self_block_id, listener.action, event.event.value)

                    }
                }
            }
        })
    }

    const listen = (listener: EngineEventListener) => {
        listeners.current.push(listener)
    }

    const unlisten = (listener: EngineEventListener) => {
        listeners.current.filter(l => l !== listener);
    }

    const getBlockValue = (ref: ExternalValueRef) => {
        const {target_block_id, target_value} = ref
        const block = blockValues.current[target_block_id]
        if (!block) {
            return null
        }
        return block[target_value]
    }

    const setBlockValue = (ref: ExternalValueRef, data: any) => {
        blockValues.current[ref.target_block_id][ref.target_value] = data
        //setBlock(ref.target_block_id)
    }

    const notifyListener = (self_block_id: string, action: string, value: string | number | boolean | undefined | null) => {
        const handler = blockHandlers.current.get(self_block_id)
        if (handler) {
            handler(action, value) //run the block's event handler!
        }
    }

    const registerBlock = (id: string, handler: (action: string, value: any) => void)=> {
        blockHandlers.current.set(id, handler);
    }

    const unregisterBlock = (id: string) => {
        blockHandlers.current.delete(id)
    }

    return {handleEvent, listen, unlisten, getBlockValue, setBlockValue, registerBlock, unregisterBlock, currentPage, setCurrentPage, pages};
}