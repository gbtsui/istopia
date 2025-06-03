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

export type TypewriterActions = (
    {action: "nextLine" | "reset", target_id: string}
)

export interface TypewriterHandle {
    nextLine: () => void;
    reset: () => void;
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

    const engine = useEngineContext(); //TODO: need to make a setBlock later...

    const [lines, setLines] = useState<string[]>([]);
    const [lineIndex, setLineIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [hasCompleted, setHasCompleted] = useState(false);

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

    const nextLine = () => {
        console.log("next line")
        if (!isTyping && lineIndex + 1 < content.length) {
            setLines(prev => [...prev, ""]);
            setLineIndex(prev => prev + 1);
            setCharIndex(0);
            setIsTyping(true);
        }
    }

    const reset = () => {
        console.log("reset")
        setLines([""]);
        setLineIndex(0);
        setCharIndex(0);
        setIsTyping(true);
    }

    const handler = (action: string) => {
        console.log("handling action!")
        switch (action) {
            case "nextLine": return nextLine();
            case "reset": return reset();
        }
    }


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
    }, [])



    useEffect(() => {
        if (hasCompleted) return;
        if (!isTyping || lineIndex >= content.length) return;

        console.log("typing useEffect running")

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
    }, [charIndex, isTyping, lineIndex, characterDelay, lineDelay, manual, content, hasCompleted]);

    useEffect(() => {
        if (
            content.length > 0 &&
            !hasCompleted &&
            !isTyping &&
            lines.length === 0
        ) {
            console.log("Initializing typewriter lines...");
            setLines([""]);
            setLineIndex(0);
            setCharIndex(0);
            setIsTyping(true);
        }
    }, [content, hasCompleted, isTyping, lines.length]);

    useEffect(() => {
        console.log("[EFFECT] isTyping:", isTyping, "charIndex:", charIndex, "lineIndex:", lineIndex, "hasCompleted:", hasCompleted);
    }, [charIndex, lineIndex, isTyping, hasCompleted]);

    return (
        <div className={className}>
            {lines.map((line, idx) => (
                <div key={idx}>{line}</div>
            ))}
        </div>
    );
}

Typewriter.displayName = "Typewriter";