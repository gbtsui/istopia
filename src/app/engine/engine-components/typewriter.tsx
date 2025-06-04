"use client";

import {
    useState,
    useEffect, useCallback,
} from "react";
import {BlockProps} from "@/app/types";
import {useEngineContext} from "@/app/engine/engine-context";

export interface TypewriterProps extends BlockProps {
    characterDelay?: number;
    lineDelay?: number;
    manual?: boolean;
}

export default function Typewriter(
    props: TypewriterProps
)  {
    const {
        id,
        content = [],
        characterDelay = 25,
        lineDelay = 1000,
        manual = false,
        className = "",
        listeners = []
    } = props;

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

    const nextLine = useCallback(() => {
        console.log("next line")
        if (!isTyping && lineIndex + 1 < content.length) {
            setLines(prev => [...prev, ""]);
            setLineIndex(prev => prev + 1);
            setCharIndex(0);
            setIsTyping(true);
        }
    }, [isTyping, lineIndex, content.length]);

    const reset = useCallback(() => {
        console.log("reset")
        setLines([""]);
        setLineIndex(0);
        setCharIndex(0);
        setIsTyping(true);
    }, [])

    const handler = useCallback((action: string) => {
        //console.log("handling action!")
        switch (action) {
            case "nextLine": return nextLine();
            case "reset": return reset();
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
            }, characterDelay);
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
                }, lineDelay);
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
            lines.length === 0
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