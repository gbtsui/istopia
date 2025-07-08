"use client";
//TODO: more triggers and events
//TODO: multiline breaks for nextLine kinda? add a setting which lets you start it but let it keep going

import {
    useState,
    useEffect, useCallback,
} from "react";
import {BlockProps} from "@/app/types";
import {useEngineContext} from "@/app/engine/engine-context";

/*
export interface TypewriterProps extends BlockProps {
    characterDelay?: number;
    lineDelay?: number;
    manual?: boolean;
}
 */

type TypewriterAdditionalProps = {
    characterDelay?: number;
    lineDelay?: number;
    manual?: boolean
}

export const TypewriterActions = ["nextLine", "reset"]
export default function Typewriter(
    props: BlockProps<TypewriterAdditionalProps>
) {
    const {
        id,
        content = [],
        className = "",
        listeners = [],
        additional_props = {
            characterDelay: 25,
            lineDelay: 1000,
            manual: false,
        }
    } = props;
    const {characterDelay, lineDelay, manual} = additional_props

    const engine = useEngineContext();

    //states
    const [lines, setLines] = useState<string[]>([]); //what lines are currently displayed?
    const [lineIndex, setLineIndex] = useState(0); //what line are we on?
    const [charIndex, setCharIndex] = useState(0); //what character are we on?
    const [isTyping, setIsTyping] = useState(false); //are we typing?
    const [hasCompleted, setHasCompleted] = useState(false); //is typing complete? (kind of redundant tbh)


    //internal methods
    const onComplete = useCallback(() => {
        if (hasCompleted) return;
        console.log("completed")
        setHasCompleted(true);
        engine.handleEvent({
            event: {
                name: "typewriter:typingComplete",
                value: null
            },
            triggering_block_id: id
        })
    }, [hasCompleted, engine, id])

    /*
    const nextLine = useCallback(() => {
        console.log("next line")
        if (!isTyping && lineIndex + 1 < content.length) {
            setLines(prev => [...prev, ""]);
            setLineIndex(prev => prev + 1);
            setCharIndex(0);
            setIsTyping(true);
        }
    }, [isTyping, lineIndex, content.length]);
     */

    const nextLine = useCallback(() => {
        console.log("next line");
        if (!isTyping) {
            if (lines.length === 0 && lineIndex === 0) {
                // Starting fresh
                setLines([""]);
                setLineIndex(0);
                setCharIndex(0);
                setIsTyping(true);
            } else if (lineIndex + 1 < content.length) {
                setLines((prev) => [...prev, ""]);
                setLineIndex((prev) => prev + 1);
                setCharIndex(0);
                setIsTyping(true);
            } else {
                console.log("All lines are typed; nextLine ignored.");
            }
        }
    }, [isTyping, lineIndex, content.length, lines.length]);

    const reset = useCallback(() => {
        console.log("reset")
        setLines([""]);
        setLineIndex(0);
        setCharIndex(0);
        setIsTyping(true);
    }, [])

    const handler = useCallback((action: string, value:  string | number | boolean | undefined | null) => {
        //console.log("handling action!")
        switch (action) {
            case "nextLine":
                if (manual) {
                    nextLine();
                } else {
                    console.log("Ignoring nextLine event because manual mode is off.");
                }
                return;
            case "reset":
                return reset();
            default:
                console.warn("A nonexistent action was passed to a typewriter: ", action)
        }
    }, [nextLine, reset]);


    //engine setup
    useEffect(() => {
        console.log("registered block in engine")
        engine.registerBlock(id, handler)

        for (const listener of listeners) {
            console.log("registering listener ", listener)
            engine.listen(listener);
        }

        return () => {
            engine.unregisterBlock(id)
        }
    }, [engine, handler, id, listeners])


    //typewrite text
    useEffect(() => {
        if (hasCompleted) return;
        if (!isTyping || lineIndex >= content.length) return;

        //debug
        //console.log("typing useEffect running")

        const currentLine = content[lineIndex];

        if (charIndex < currentLine.length) {
            const timeout = setTimeout(() => {
                setLines(prev => {
                    const updated = [...prev];
                    updated[lineIndex] =
                        (updated[lineIndex] || "") + currentLine[charIndex];
                    return updated;
                });
                setCharIndex(prev => prev + 1);
            }, characterDelay as number);
            return () => clearTimeout(timeout);
        } else {
            if (lineIndex + 1 >= content.length && !hasCompleted) {
                setIsTyping(false);
                onComplete();
            } else if (!manual) {
                const timeout = setTimeout(() => {
                    setLines(prev => [...prev, ""]);
                    setLineIndex(prev => prev + 1);
                    setCharIndex(0);
                    setIsTyping(true);
                }, lineDelay as number);
                return () => clearTimeout(timeout);
            }
        }
    }, [charIndex, isTyping, lineIndex, characterDelay, lineDelay, manual, content, hasCompleted, onComplete]);

    //initialize typing
    useEffect(() => {
        if (
            content.length > 0 &&
            !hasCompleted &&
            !isTyping &&
            lines.length === 0 &&
            !manual
        ) {
            //debug
            //console.log("Initializing typewriter lines...");
            setLines([""]);
            setLineIndex(0);
            setCharIndex(0);
            setIsTyping(true);
        }
    }, [content, hasCompleted, isTyping, lines.length]);

    //debug
    /*
    useEffect(() => {
        console.log("[EFFECT] isTyping:", isTyping, "charIndex:", charIndex, "lineIndex:", lineIndex, "hasCompleted:", hasCompleted);
    }, [charIndex, lineIndex, isTyping, hasCompleted]);
     */

    return (
        <div className={className}>
            {lines.map((line, idx) => (
                <div key={idx}>{line}</div>
            ))}
        </div>
    );
}

Typewriter.displayName = "Typewriter";