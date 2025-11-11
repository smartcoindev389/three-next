import React, { useRef, useState, useEffect, useMemo } from "react";
import { Mesh } from "three";
import { gsap } from "gsap";
//import { Board } from "../Board";
//import { Person } from "./person";
import { Board } from "@/shared/components/(main)/ThreeScene/Board";
import { Person } from "@/shared/components/(main)/ThreeScene/Person";
import { AnimationController, AnimationData } from "@/utils/AnimationScrollController";
import { useThree } from '@react-three/fiber';
import { TEAM_CONFIG } from '../_presets-data/teamConfig';


/******************
 * 
 *  Генератор сцени з персонами
 * 
 * 
 *******/


type Vec3 = [number, number, number];

interface BaseBoard {
  idx: number;
  startPosition: Vec3;
  finishedPosition: Vec3;
  forwardPosition: Vec3;
  mainText?: string;
  subText?: string;
  isActive?: boolean;
  assetPath?: string;
  photoW?: number;
  textOffsetX?: number;
  textOffsetY?: number;
  gap?: number;
  type?: string;
  name?: string;
  role?: string;
  description?: string;
  delay: number;
  duration?: number;
  startDelay?: number;
  closedDelay?: number;
  forwardDelay?: number;
  startDuration?: number;
  closedDuration?: number;
  forwardDuration?: number;
}



type BoardItem = BaseBoard;



type CreatePreset = {
  desktop: (persons: any[]) => BoardItem[];
  laptop: (persons: any[]) => BoardItem[];
  tablet: (persons: any[]) => BoardItem[];
  mobile: (persons: any[]) => BoardItem[];
  names: string;
};

type AnimatedPersonProps = {
  createPreset: CreatePreset;
  persons: any[];
};

export const AnimatedPerson = React.memo(({ createPreset, persons }: AnimatedPersonProps) => {
  // Get actual screen pixel size from Three.js
  const { size } = useThree();

  // Detect current breakpoint based on actual screen width (in pixels)
  const currentBreakpoint = useMemo(() => {
    const screenWidth = size.width;
    if (screenWidth >= TEAM_CONFIG.breakpoints.desktop) return 'desktop';
    if (screenWidth >= TEAM_CONFIG.breakpoints.laptop) return 'laptop';
    if (screenWidth >= TEAM_CONFIG.breakpoints.tablet) return 'tablet';
    return 'mobile';
  }, [size.width]);

  const boardsData = useMemo<BoardItem[]>(() => {
    return createPreset[currentBreakpoint](persons);
  }, [currentBreakpoint, createPreset, persons]);

  const personRef = useRef<(Mesh | null)[]>([]);
  const opacitiesRef = useRef<{ value: number }[]>(
    boardsData.map(() => ({ value: 0 }))
  );
  const [, forceUpdate] = useState({});



  useEffect(() => {
    const namePresetGroup = createPreset.names;
    const data: AnimationData = {
      [namePresetGroup + ' open']: [],
      [namePresetGroup + ' closed']: [],
      [namePresetGroup + ' forward']: []
    };

    personRef.current.forEach((mesh, i) => {
      if (!mesh) return;

      const {
        startPosition,
        finishedPosition,
        forwardPosition,
        delay,
        duration
      } = boardsData[i];

      mesh.position.set(...startPosition);
      mesh.visible = false;

      data[namePresetGroup + ' open'].push(
        ['call', () => { mesh.visible = true; }, 0, delay],
        [
          'to',
          mesh.position,
          {
            x: finishedPosition[0],
            y: finishedPosition[1],
            z: finishedPosition[2],
            duration,
            ease: "power1.inOut",
            onStart: () => { mesh.visible = true; },
            onComplete: () => {
              mesh.userData.levitationTween?.kill?.();
              mesh.userData.levitationTween = gsap.to(mesh.position, {
                y: finishedPosition[1] + (Math.random() * 0.5 - 0.3),
                x: finishedPosition[0] + (Math.random() * 0.5 - 0.3),
                duration: 2,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
              });
            }
          },
          delay
        ]
      );

      data[namePresetGroup + ' open'].push([
        'to',
        opacitiesRef.current[i],
        {
          value: 1,
          duration,
          ease: "power1.inOut",
          onUpdate: () => forceUpdate({}),
        },
        delay
      ]);

      data[namePresetGroup + ' closed'].push([
        'to',
        opacitiesRef.current[i],
        {
          value: 0,
          ease: "power1.inOut",
          duration: 1.1,
          onStart: () => {
            mesh.userData.levitationTween?.kill();
          },
          onUpdate: () => forceUpdate({}),
        },
        delay
      ]);

      data[namePresetGroup + ' closed'].push([
        'to',
        mesh.position,
        {
          x: startPosition[0],
          y: startPosition[1],
          z: startPosition[2],
          duration,
          ease: "power1.inOut",
        },
        delay
      ]);

      data[namePresetGroup + ' forward'].push([
        'to',
        mesh.position,
        {
          x: forwardPosition[0],
          y: forwardPosition[1],
          z: forwardPosition[2],
          duration,
          ease: "power1.inOut",
          onStart: () => {
            mesh.userData.levitationTween?.kill();
          },
        },
        delay
      ]);

      data[namePresetGroup + ' forward'].push([
        'to',
        opacitiesRef.current[i],
        {
          value: 0,
          duration: 1.1,
          ease: "power1.inOut",
          onUpdate: () => forceUpdate({}),
        },
        delay
      ]);
    });

    AnimationController.register(data);

    // Cleanup: remove animations when component unmounts or boardsData changes
    return () => {
      AnimationController.remove(namePresetGroup + ' open');
      AnimationController.remove(namePresetGroup + ' closed');
      AnimationController.remove(namePresetGroup + ' forward');
    };
  }, [boardsData, createPreset.names]);

  return (
    <group>
      {boardsData.map((item, i) => {
        const isPerson = 'type' in item && item.type === 'Person';
        const opacity = opacitiesRef.current[i].value;

        if (isPerson) {
          const person = item as BaseBoard;
          return (
            <Person
              key={createPreset.names + person.idx}
              name={person.name ?? ""}
              role={person.role}
              description={person.description}
              ref={(el: Mesh | null) => {
                personRef.current[i] = el;
              }}
              photoW={person.photoW}
              textOffsetX={person.textOffsetX}
              textOffsetY={person.textOffsetY}
              gap={person.gap}
              opacity={opacity}
              assetPath={person.assetPath ?? ""}
            />
          );
        } else {
          const board = item as BaseBoard;
          return (
            <Board
              key={createPreset.names + board.idx}
              ref={(el: Mesh | null) => {
                personRef.current[i] = el;
              }}
              idx={board.idx}
              position={board.startPosition}
              isActive={board.isActive}
              boardWidth={8}
              boardHeight={8}
              boardDepth={0.0}
              mainText={board.mainText}
              subText={board.subText}
              handleToggle={() => { }}
              opacity={opacity}
            />
          );
        }
      })}
    </group>
  );
});

AnimatedPerson.displayName = "AnimatedPerson";
