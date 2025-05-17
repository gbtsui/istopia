"use client";

import {
    useImperativeHandle,
    useState,
    useEffect,
    Ref
} from "react";
import {BlockProps} from "@/app/types";

export interface TypewriterProps extends BlockProps {
    characterDelay?: number;
    lineDelay?: number;
    manual?: boolean;
    onComplete?: () => void;
    ref?: Ref<TypewriterHandle>
}

export interface TypewriterHandle {
    nextLine: () => void;
    reset: () => void;
}

export default function Typewriter(
    {text, characterDelay=25, lineDelay=1000, manual=false, className="", onComplete, ref}: TypewriterProps,
)  {
    const [lines, setLines] = useState<string[]>([]);
    const [lineIndex, setLineIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);

    useImperativeHandle(ref, () => ({
        nextLine() {
            if (!isTyping && lineIndex + 1 < text.length) {
                setLines(prev => [...prev, ""]);
                setLineIndex(prev => prev + 1);
                setCharIndex(0);
                setIsTyping(true);
            }
        },
        reset() {
            setLines([""]);
            setLineIndex(0);
            setCharIndex(0);
            setIsTyping(true);
        }
    }));

    useEffect(() => {
        if (!isTyping || lineIndex >= text.length) return;

        const currentLine = text[lineIndex];

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
            if (lineIndex + 1 >= text.length) {
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
    }, [charIndex, isTyping, lineIndex, characterDelay, lineDelay, manual, text]);

    useEffect(() => {
        if (text.length > 0) setLines([""]);
        setIsTyping(true);
    }, [text]);
    return (
        <div className={className}>
            {lines.map((line, idx) => (
                <div key={idx}>{line}</div>
            ))}
        </div>
    );
}

Typewriter.displayName = "Typewriter";