'use client';
import React, { useRef, useState, useEffect, useMemo } from "react";
import { Mesh } from "three";
import { Board } from "@/shared/components/(main)/ThreeScene/Board";
import { AnimationController, AnimationData } from "@/utils/AnimationScrollController";
import { gsap } from "gsap";
import { useScreenBounds } from '@/hooks/useScreenBounds';


/**************
 * 
 * Генератор сцени з дошками
 * 
 * 
 **************/

type Vec3 = [number, number, number];

type BaseBoard = {
  startPosition: Vec3;
  finishedPosition: Vec3;
  forwardPosition: Vec3;
  startDelay: number;
  closedDelay: number;
  forwardDelay: number;
  startDuration: number;
  closedDuration: number;
  forwardDuration: number;
  mainText: string;
  subText: string;
  isActive: boolean;
};

type BoardItem = BaseBoard & {
  idx?: number;
};

type CreatePreset = {
  sizeBordMob: number;
  gapBordMob: number;
  sizeBordDec: number;
  gapBordDec: number;
  mob: (gap: number, items: any[]) => BoardItem[];
  dec: (gap: number, items: any[]) => BoardItem[];
  name: string;
};

type AnimatedTunnelProps = {
  createPreset: CreatePreset;
  items: any[];
};







export const AnimatedTunnel = React.memo(({ createPreset, items }: AnimatedTunnelProps) => {
  const tunellRefs = useRef<(Mesh | null)[]>([]);
  const bounds = useScreenBounds();


  const [boardsData, boardWidth] = useMemo<[BoardItem[], number]>(() => {
    const param = createPreset;
    const vmin = (bounds.width > bounds.height) ? bounds.height : bounds.width;

    if (bounds.height > bounds.width) {
      const boardWidth = vmin / param.sizeBordMob;
      const gap = boardWidth + (vmin / param.gapBordMob);
      return [param.mob(gap, items), boardWidth];
    } else {
      const boardWidth = vmin / param.sizeBordDec;
      const gap = boardWidth + (vmin / param.gapBordDec);
      return [param.dec(gap, items), boardWidth];
    }



  }, [bounds]);


  const [opacities, setOpacities] = useState(() =>
    boardsData.map(() => ({ value: 0 }))
  );


  useEffect(() => {
    const namePresetGroup = createPreset.name;
    const data: AnimationData = {
      [namePresetGroup + ' open']: [],
      [namePresetGroup + ' closed']: [],
      [namePresetGroup + ' forward']: []
    }

    tunellRefs.current.forEach((group, i) => {
      if (!group) return;
      const { startPosition, finishedPosition, forwardPosition, startDelay, closedDelay, forwardDelay, startDuration, closedDuration, forwardDuration } = boardsData[i];

      const mesh = group;

      mesh.position.x = startPosition[0];
      mesh.position.y = startPosition[1];
      mesh.position.z = startPosition[2];
      mesh.visible = false;


      data[namePresetGroup + ' open'].push(
        ['call', () => { mesh.visible = true; }, 0, 0],
        ['to',
          mesh.position,
          {
            x: finishedPosition[0],
            y: finishedPosition[1],
            z: finishedPosition[2],
            duration: startDuration,
            ease: "power1.inOut",
            onComplete: () => {
              // зупиняємо попередню левітацію, якщо є
              mesh.userData.levitationTween?.kill();

              // створюємо нову
              mesh.userData.levitationTween = gsap.to(mesh.position, {
                y: finishedPosition[1] + (Math.random() * (0.8 - -0.2) + -0.3),
                x: finishedPosition[0] + (Math.random() * (0.8 - -0.2) + -0.3),
                duration: 2,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                repeatRefresh: true,

              });
            },
          },
          startDelay
        ]);

      data[namePresetGroup + ' open'].push([
        'to',
        opacities[i],
        {
          value: 1,
          duration: startDuration,
          ease: "power1.inOut",
          onUpdate: () => setOpacities([...opacities]),
        },
        startDelay
      ]);



      data[namePresetGroup + ' closed'].push([
        'to',
        opacities[i],
        {
          value: 0,
          duration: closedDuration,
          ease: "power1.inOut",
          onUpdate: () => setOpacities([...opacities]),
        },
        closedDelay
      ]);

      data[namePresetGroup + ' closed'].push([
        'to',
        mesh.position,
        {
          x: startPosition[0],
          y: startPosition[1],
          z: startPosition[2],
          duration: closedDuration,
          ease: "power1.inOut",
          repeatRefresh: true,
          onComplete: () => {
            mesh.userData.levitationTween?.kill();
            mesh.visible = false;
          }

        },
        closedDelay,
      ]);



      data[namePresetGroup + ' forward'].push([
        'to',
        opacities[i],
        {
          value: 0,
          duration: forwardDuration,
          ease: "power1.inOut",
          onUpdate: () => setOpacities([...opacities]),
        },
        forwardDelay
      ]);

      data[namePresetGroup + ' forward'].push([
        'to',
        mesh.position,
        {
          x: forwardPosition[0],
          y: forwardPosition[1],
          z: forwardPosition[2],
          duration: forwardDuration,
          repeatRefresh: true,
          ease: "power1.inOut",
          onComplete: () => {
            mesh.visible = false;
          },
          onStart: () => {
            mesh.userData.levitationTween?.kill();
          }
        },
        forwardDelay,
      ]);

    });


    AnimationController.register(data);
  }, [bounds, createPreset, boardsData]);

  return (
    <group>
      {boardsData.map(({ startPosition, mainText, subText, isActive, idx }, i) => (

        <Board
          key={createPreset.name + idx}
          ref={(el: Mesh | null) => { tunellRefs.current[i] = el; }}
          idx={idx!}
          position={startPosition as [number, number, number]}
          isActive={isActive}
          boardWidth={boardWidth}
          boardHeight={boardWidth}
          boardDepth={0.01}
          mainText={mainText}
          subText={subText}
          handleToggle={() => { }}
          opacity={opacities[i].value}
        />
      ))}
    </group>
  );
});

AnimatedTunnel.displayName = "AnimatedTunnel";
