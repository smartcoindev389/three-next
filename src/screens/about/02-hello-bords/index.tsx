'use client';
import React, { useRef, useEffect, useMemo } from "react";
import { Mesh } from "three";
import { Board } from "@/shared/components/(main)/ThreeScene/Board";
import { AnimationController, AnimationData } from "@/utils/AnimationScrollController";
import { useScreenBounds } from '@/hooks/useScreenBounds';
import texts from '../_text-data/index.json';

/***********
 * 
 *  Стартова анімація з дошками
 * 
 * 
 */

interface Params {
  gap?: number;
  size?: number;
  bottom?: number;
  left?: number;
}

const CreateBoardsDataMob = (param: Params, items: any[]) => {
  let { gap, size } = param;
  size = (size ?? 1) / 2;
  gap = (gap ?? 1) / 2;
  return [
    {
      idx: 150,
      startPosition: [-50, 100, 50],
      finishedPosition: [-((size) + gap), 0, 0],
      forwardPosition: [-4.5, 60, 60],
      startDuration: 1.25,
      closedDuration: 1.1,
      forwardDuration: 1.1,
      startDelay: 0.1,
      closedDelay: 0,
      forwardDelay: 0,
      mainText: items[0]?.title || texts.hello_bords.bord2.mainText,
      subText: items[0]?.content || texts.hello_bords.bord2.subText,
      isActive: true,
      startRotation: [8, 7, 6],
      finalRotation: [0, 0, 0],
      forwardRotation: [4, 5, -1],
    },

    {
      idx: 151,
      startPosition: [-50, -50, 170],
      finishedPosition: [-((size * 3) + (gap * 3)), 0, 0],
      forwardPosition: [-18.64, 16.57, 60],
      startDuration: 1.2,
      closedDuration: 1.1,
      forwardDuration: 1.1,
      startDelay: 0.25,
      closedDelay: 0,
      forwardDelay: 0,
      mainText: items[1]?.title || texts.hello_bords.bord1.mainText,
      subText: items[1]?.content || texts.hello_bords.bord1.subText,
      isActive: true,
      startRotation: [8, 8, 3],
      finalRotation: [0, 0, 0],
      forwardRotation: [5, 6, 4],
    },

    {
      idx: 152,
      startPosition: [25, 120, 50],
      finishedPosition: [size + gap, 0, 0],
      forwardPosition: [3, 3, 55],
      startDuration: 1,
      closedDuration: 1,
      forwardDuration: 1,
      startDelay: 0,
      closedDelay: 0,
      forwardDelay: 0.1,
      mainText: items[2]?.title || texts.hello_bords.bord3.mainText,
      subText: items[2]?.content || texts.hello_bords.bord3.subText,
      isActive: true,
      startRotation: [18, 23, 36],
      finalRotation: [0, 0, 0],
      forwardRotation: [2, -2, -0.5],
    },

    {
      idx: 153,
      startPosition: [30, 130, 50],
      finishedPosition: [(size * 3) + (gap * 3), 0, 0],
      forwardPosition: [10, 35, 58],
      startDuration: 1.1,
      closedDuration: 1.1,
      forwardDuration: 1,
      startDelay: 0,
      closedDelay: 0.5,
      forwardDelay: 0,
      mainText: items[3]?.title || texts.hello_bords.bord4.mainText,
      subText: items[3]?.content || texts.hello_bords.bord4.subText,
      isActive: true,
      startRotation: [18, 27, 36],
      finalRotation: [0, 0, 0],
      forwardRotation: [1.5, 1.5, 0.5],
    }
  ]
};








const CreateBoardsData = (param: Params, items: any[]) => {
  const { left = 0, bottom = 0 } = param;
  let { gap, size } = param;
  size = (size ?? 1) / 2;
  gap = (gap ?? 1) / 2;
  return [

    {
      idx: 170,
      startPosition: [50, 100, 50],
      finishedPosition: [((size + gap) * 4) + left, ((size + gap) * 2) + bottom, 0],
      forwardPosition: [4.14, 16.57, 85],
      startDuration: 1.1,
      closedDuration: 1.1,
      forwardDuration: 1.1,
      startDelay: 0,
      closedDelay: 0,
      forwardDelay: 0,
      mainText: items[0]?.title || texts.hello_bords.bord1.mainText,
      subText: items[0]?.content || texts.hello_bords.bord1.subText,
      isActive: true,
      startRotation: [50, 50, 50],
      finalRotation: [0, 0, 0],
      forwardRotation: [1.9, 1.8, 1.7],
    },
    {
      idx: 171,
      startPosition: [-100, 100, 50],
      finishedPosition: [left, bottom, 0],
      forwardPosition: [-100, 100, 60],
      startDuration: 1.1,
      closedDuration: 1.1,
      forwardDuration: 1.1,
      startDelay: 0,
      closedDelay: 0,
      forwardDelay: 0,
      mainText: items[1]?.title || texts.hello_bords.bord2.mainText,
      subText: items[1]?.content || texts.hello_bords.bord2.subText,
      isActive: true,
      startRotation: [25, 25, 15],
      finalRotation: [0, 0, 0],
      forwardRotation: [-1.9, -1.8, -1.7],
    },
    {
      idx: 172,
      startPosition: [50, 100, 50],
      finishedPosition: [left, (-((size + gap) * 2)) + bottom, 0],
      forwardPosition: [4.14, 16.57, 60],
      startDuration: 1.1,
      closedDuration: 1.1,
      forwardDuration: 1.1,
      startDelay: 0,
      closedDelay: 0,
      forwardDelay: 0,
      mainText: "",
      subText: "",
      isActive: false,
      startRotation: [50, 50, 50],
      finalRotation: [0, 0, 0],
      forwardRotation: [0.9, 0.8, 0.7],
    },


    {
      idx: 173,
      startPosition: [50, 100, 50],
      finishedPosition: [((size + gap) * 2) + left, ((size + gap) * 2) + bottom, 0],
      forwardPosition: [4.14, 16.57, 60],
      startDuration: 1.1,
      closedDuration: 1.1,
      forwardDuration: 1.1,
      startDelay: 0,
      closedDelay: 0,
      forwardDelay: 0,
      mainText: "",
      subText: "",
      isActive: false,
      startRotation: [50, 50, 50],
      finalRotation: [0, 0, 0],
      forwardRotation: [0.9, 0.8, 0.7],
    },
    {
      idx: 174,
      startPosition: [50, 100, 50],
      finishedPosition: [((size + gap) * 2) + left, bottom, 0],
      forwardPosition: [4.14, 16.57, 60],
      startDuration: 1.1,
      closedDuration: 1.1,
      forwardDuration: 1.1,
      startDelay: 0,
      closedDelay: 0,
      forwardDelay: 0,
      mainText: items[2]?.title || texts.hello_bords.bord3.mainText,
      subText: items[2]?.content || texts.hello_bords.bord3.subText,
      isActive: true,
      startRotation: [50, 50, 50],
      finalRotation: [0, 0, 0],
      forwardRotation: [0.9, 0.8, 0.7],
    },
    ///////////////////////////////////////////////////////

    {
      idx: 175,
      startPosition: [-100, -250, 150],
      finishedPosition: [(-(size + gap) * 2) + left, (-(size + gap) * 2) + bottom, 0],
      forwardPosition: [-100, -250, 60],
      startDuration: 1.1,
      closedDuration: 1.1,
      forwardDuration: 1.1,
      startDelay: 0,
      closedDelay: 0,
      forwardDelay: 0,
      mainText: items[4]?.title || texts.hello_bords.bord4.mainText,
      subText: items[4]?.content || texts.hello_bords.bord4.subText,
      isActive: true,
      startRotation: [50, 50, 50],
      finalRotation: [0, 0, 0],
      forwardRotation: [0.9, 0.8, 0.7],
    },

    {
      idx: 176,
      startPosition: [50, 100, 50],
      finishedPosition: [((size + gap) * 4) + left, (-(size + gap) * 2) + bottom, 0],
      forwardPosition: [4.14, 55.57, 60],
      startDuration: 1.1,
      closedDuration: 1.1,
      forwardDuration: 1.1,
      startDelay: 0,
      closedDelay: 0,
      forwardDelay: 0,
      mainText: "",
      subText: "",
      isActive: false,
      startRotation: [50, 50, 50],
      finalRotation: [0, 0, 0],
      forwardRotation: [0.7, 0.6, 0.5],
    }


  ]
};


export const AnimatedBoard = React.memo(({ items }: { items: any[] }) => {
  const boardsRefs = useRef<(Mesh | null)[]>([]);
  const bounds = useScreenBounds();


  const [boardWidth, animatedData] = useMemo(() => {
    const vmin = (bounds.width > bounds.height) ? bounds.height : bounds.width;

    let paramData;
    let boardWidth;

    if (bounds.height > bounds.width) { //////// mob
      boardWidth = vmin / 5;
      const size = boardWidth;
      const gap = boardWidth / 10;
      const bottom = 0;
      const left = 0;

      paramData = {
        size: size,
        gap: gap,
        bottom: bottom,
        left: left,
      };


    } else { ///// dec
      boardWidth = vmin / 6;
      const size = boardWidth;
      const gap = boardWidth / 10;
      const bottom = (bounds.bottom + (boardWidth * 2));
      const left = bounds.right - (boardWidth * 3.25);



      paramData = {
        size: size,
        gap: gap,
        bottom: bottom,
        left: left,
      }

    }


    return [boardWidth, (bounds.height > bounds.width) ? CreateBoardsDataMob(paramData, items) : CreateBoardsData(paramData, items)];

  }, [bounds, items]);


  useEffect(function () {
    const data: AnimationData = {
      'section 1 open': [],
      'section 1 close': [],
      'section 1 forward': []
    }

    boardsRefs.current.forEach((mesh, i) => {
      if (!mesh) return;

      const { startPosition, finishedPosition, forwardPosition, startRotation, finalRotation, forwardRotation, startDuration, closedDuration, forwardDuration, startDelay, closedDelay, forwardDelay } = animatedData[i];

      mesh.position.x = startPosition[0];
      mesh.position.y = startPosition[1];
      mesh.position.z = startPosition[1];

      mesh.rotation.x = startRotation[0];
      mesh.rotation.y = startRotation[1];
      mesh.rotation.z = startRotation[2];
      mesh.visible = true;


      mesh.visible = false;

      data['section 1 open'].push(
        ['call', () => { mesh.visible = true; }, 0, 0],
        [
          'to',
          mesh.rotation,
          {
            x: finalRotation[0],
            y: finalRotation[1],
            z: finalRotation[2],
            duration: startDuration,
            ease: "easeInOut"

          },
          startDelay
        ]
      );

      data['section 1 open'].push([
        'to',
        mesh.position,
        {
          x: finishedPosition[0],
          y: finishedPosition[1],
          z: finishedPosition[2],
          duration: startDuration,
          ease: "power1.inOut",

        },
        startDelay

      ]
      );


      data['section 1 close'].push([
        'to',
        mesh.rotation,
        {
          x: finalRotation[0],
          y: finalRotation[1],
          z: finalRotation[2],
          duration: closedDuration,
          ease: "easeInOut"

        },
        closedDelay
      ]);


      data['section 1 close'].push([
        'to',
        mesh.position,
        {
          x: startPosition[0],
          y: startPosition[1],
          z: startPosition[2],
          duration: closedDuration,
          ease: "power1.inOut",
          onComplete: () => {
            mesh.visible = false;
          },

        },
        closedDelay

      ]);

      data['section 1 forward'].push([
        'to',
        mesh.rotation,
        {
          x: forwardRotation[0],
          y: forwardRotation[1],
          z: forwardRotation[2],
          duration: forwardDuration,
          ease: "easeInOut"

        },
        forwardDelay
      ]
      );

      data['section 1 forward'].push([
        'to',
        mesh.position,
        {
          x: forwardPosition[0],
          y: forwardPosition[1],
          z: forwardPosition[2],
          duration: forwardDuration,
          ease: "power1.inOut",
          onComplete: () => {
            mesh.visible = false;
          },
        }
        ,
        forwardDelay

      ]
      );


    });
    AnimationController.register(data);

  }, [bounds, animatedData, boardWidth]);


  return (
    <group>
      {animatedData.map(({ idx, startPosition, startRotation, mainText, subText, isActive }, i) => (
        <Board
          key={idx}
          ref={(el: Mesh | null) => { boardsRefs.current[i] = el; }}
          idx={idx}
          position={startPosition as [number, number, number]}
          rotation={startRotation as [number, number, number]}
          boardWidth={boardWidth}
          boardHeight={boardWidth}
          boardDepth={0.01}
          mainText={mainText}
          subText={subText}
          handleToggle={() => { }}
          isActive={isActive}
        />
      ))}
    </group>
  );
});



AnimatedBoard.displayName = "AnimatedBoard";