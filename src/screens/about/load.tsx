"use client";

import React, { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { AnimationController } from "@/utils/AnimationScrollController";
import NebulaV2 from "@/shared/components/(main)/ThreeScene/Nebula/v2";
import CursorTrail from "@/shared/components/(main)/ThreeScene/CursorTrail";
import MovingLightV2 from "@/shared/components/(main)/ThreeScene/MovingLight/v2";





export const LoadNebulaV2 = React.memo(function About2() {
    const [triggerExplosion, setTriggerExplosion] = useState(false);
    const [, setSceneReady] = useState(false);
    const { progress } = useProgress();


    useEffect(() => {
        if (progress !== 100) return;

        setSceneReady(true);

        const timeout = setTimeout(() => {
            setTriggerExplosion(true);
            AnimationController.blockDelay(null);
            AnimationController.play("section Text start");
            AnimationController.play("section 1 open");

        }, 500);

        return () => clearTimeout(timeout);
    }, [progress]);



    return (
        <group>
            <ambientLight color="#5500aa" intensity={50} />
            <MovingLightV2 />
            <CursorTrail />


            <NebulaV2
                triggerExplosion={triggerExplosion}
                triggerAssemble={!triggerExplosion}
                onExplosionEnd={() => { }}
                defaultState="exploding"
            />
        </group>
    )

});