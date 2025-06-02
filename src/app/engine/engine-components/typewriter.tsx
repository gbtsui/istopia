"use client";

import {
    useState,
    useEffect,
} from "react";
import {BlockProps} from "@/app/types";
import {EngineEventListener, useEngine} from "@/app/engine";

export interface TypewriterProps extends BlockProps {
    characterDelay?: number;
    lineDelay?: number;
    manual?: boolean;

    listeners?: Array<EngineEventListener>
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
    } = props;

    const engine = useEngine(() => {}); //TODO: need to make a setBlock later...

    const [lines, setLines] = useState<string[]>([]);
    const [lineIndex, setLineIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);

    const onComplete = () => {
        engine.handleEvent({
            event: {
                name: "typewriter:typingComplete",
                value: null
            },
            triggering_block_id: id
        })
    }

    const nextLine = () => {
        if (!isTyping && lineIndex + 1 < content.length) {
            setLines(prev => [...prev, ""]);
            setLineIndex(prev => prev + 1);
            setCharIndex(0);
            setIsTyping(true);
        }
    }

    const reset = () => {
        setLines([""]);
        setLineIndex(0);
        setCharIndex(0);
        setIsTyping(true);
    }

    const handler = (action: string) => {
        switch (action) {
            case "nextLine": return nextLine();
            case "reset": return reset();
        }
    }



    useEffect(() => {
        engine.registerBlock(id, handler)
    })

    useEffect(() => {
        if (!isTyping || lineIndex >= content.length) return;

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
            if (lineIndex + 1 >= content.length) {
                setIsTyping(false);
                onComplete?.();
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
    }, [charIndex, isTyping, lineIndex, characterDelay, lineDelay, manual, content]);

    useEffect(() => {
        if (content.length > 0) setLines([""]);
        setIsTyping(true);
    }, [content]);



    return (
        <div className={className}>
            {lines.map((line, idx) => (
                <div key={idx}>{line}</div>
            ))}
        </div>
    );
}

Typewriter.displayName = "Typewriter";