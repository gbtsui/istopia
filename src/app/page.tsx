"use client";

import {motion, useScroll, useTransform} from "framer-motion";
import {useRef, useState} from "react";

export default function Home(){
    const targetRef = useRef(null);

    const {scrollYProgress} = useScroll({
        target: targetRef,
        offset: ["start start", "end start"],
    });

    const top_opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0])
    const section_1_opacity = useTransform(scrollYProgress, [0.9, 1], [1, 0])

    console.log(top_opacity)

    return (
        <>
            <div className={"relative"}>
                <motion.div style={{opacity: top_opacity}} ref={targetRef} className={"top-0 h-screen flex items-center justify-center gap-7"}>
                    <h1 className={"text-6xl"}>istopia</h1>
                    <h2 className={"text-xl text-gray-300"}>write beyond your words.</h2>
                    {/*
                    SHOW ME THE SOUND DON'T LET IT FADE AWAYYYYYYYYYYYYYYYYYYYY
                    I CAN SEE YOU CAME FROM FAR AWAY
                    THE FACT THAT WE WOULD MEET IT MUST BE FATE
                    FAR ACROSS THE OCEAN'S WATERS DREAMING FOR ESCAPE
                    FAINTLY
                    A HIDDEN LIGHT
                    THAT IS LOST INSIDE YOUR EYES
                    YEARNING FOR A CHANCE TO BURN BRIGHT
                    */}
                </motion.div>
                <motion.div style={{opacity: section_1_opacity}} className={"sticky top-0 h-screen flex flex-row-reverse items-center justify-start bg-gray-900"}>
                    <h3 className={"text-3xl"}>yet another platform for writers?</h3>
                    <motion.div className={"p-6 m-3 w-[32rem] bg-gray-700 rounded-2xl"}>
                        <p className={""}>
                            words are everywhere. you can find writing platforms in every corner of the internet.
                            what if you wanted something... bigger?
                        </p>
                    </motion.div>
                    {/*
                    uhh skibidi toilet idk
                    */}
                </motion.div>
            </div>
        </>
    )
}