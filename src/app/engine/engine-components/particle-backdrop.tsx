"use client";

import {useEffect, useState} from "react";
import {loadSlim} from "@tsparticles/slim";
import {Engine} from "@tsparticles/engine";
import Particles, {initParticlesEngine} from "@tsparticles/react";
import type {Container} from "@tsparticles/engine"

interface ParticlesBackgroundProps {
    id: string;
    particleColor?: string;
    particleCount?: number;
    opacity?: number;
    backgroundColor?: string;
    zIndex?: number;
    fullscreen?: boolean;
    links?: boolean;
}

export default function ParticleBackdrop(
    {
        id,
        particleColor = "#ffffff",
        particleCount = 100,
        opacity = 0.2,
        backgroundColor = undefined,
        zIndex = -1,
        fullscreen = true,
        links = true
    }: ParticlesBackgroundProps,
) {
    const [initialized, setInitialized] = useState(false);
    useEffect(() => {
        initParticlesEngine(async (engine: Engine) => {
            await loadSlim(engine);
        }).then(() => {setInitialized(true); console.log("engine initialized")});
    }, []);

    const particlesLoaded = async (container?: Container): Promise<void> => {console.log(container)}

    if (initialized) {
        console.log("initialized! particles spawning");
        return (
            <Particles
                id={id}
                particlesLoaded={particlesLoaded}
                options={{
                    fullScreen: {
                        enable: fullscreen,
                        zIndex: zIndex,
                    },
                    particles: {
                        number: {
                            value: particleCount,
                            density: {
                                enable: true,
                            }
                        },
                        color: {
                            value: particleColor
                        },
                        opacity: {
                            value: opacity,
                        },
                        size: {
                            value: 2,
                        },


                        move: {
                            enable: true,
                            speed: {min: 1, max: 5},
                            direction: 'none',
                            outModes: {
                                default: 'out'
                            }
                        },
                        links: {
                            enable: links
                        }
                    },
                    interactivity: {
                        events: {
                            onClick: {
                                enable: true,
                                mode: "push",
                            },
                            onHover: {
                                enable: true,
                                mode: "repulse",
                            },
                        },
                        modes: {
                            push: {
                                quantity: 4,
                            },
                            repulse: {
                                distance: 100,
                                duration: 0.4,
                            },
                        },
                    },
                    background: backgroundColor? {color: backgroundColor} : undefined
                }}
            />
        )
    }

    return <></>
}