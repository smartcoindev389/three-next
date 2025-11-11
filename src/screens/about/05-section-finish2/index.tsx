'use client';
import React, { useRef, useEffect, useMemo, useState } from "react";
import { Mesh } from "three";
import { Board } from "@/shared/components/(main)/ThreeScene/Board";
import { AnimationController, AnimationData } from "@/utils/AnimationScrollController";
import { useScreenBounds } from '@/hooks/useScreenBounds';
import { Text } from "@react-three/drei";
import texts from '../_text-data/index.json';


/***********
 * 
 *  Фінальна секція
 * 
 * 
 */


/////// описуємо анімацію для кожної дошки / портрет
const CreateBoardsDataMob = (gap: number, size: number, left: number, top: number, items: any[], title: string) => {
  size = (size ?? 1) / 2;
  gap = (gap ?? 1) / 2;
  return [
    {
      idx: 499,
      type: 'text',
      fontSize: gap / 3,
      startPosition: [gap, gap * 4, 70],
      finishedPosition: [left + (gap / 2), top + -(gap / 0.75), 0.5],
      forwardPosition: [left + (gap / 2), top + -(gap / 0.75), 0.5],
      startDuration: 1.1,
      closedDuration: 1.1,
      forwardDuration: 1.1,
      startDelay: 0,
      closedDelay: 0,
      forwardDelay: 0.2,
      mainText: title,
      isActive: true,
      startRotation: [0.0, 0.0, 0.0],
      finalRotation: [0, 0, 0],
      forwardRotation: [0.0, 0.0, 0.0],
      ease: "sine.in"
    },

    {
      idx: 500,
      type: 'border',
      startPosition: [gap * 6, 0, 110],
      finishedPosition: [0, gap, 0],
      forwardPosition: [gap * 1, 35, -50],
      startDuration: 1.1,
      closedDuration: 1.1,
      forwardDuration: 1.1,
      startDelay: 0.25,
      closedDelay: 0,
      forwardDelay: 0.1,
      mainText: items[0]?.title,
      subtitle: items[0]?.subtitle,
      subText: items[0]?.description,
      isActive: true,
      startRotation: [0, 5, 0],
      finalRotation: [0, 0, 0],
      forwardRotation: [0.9, 0.8, 0.7],
      ease: "easeInOut"
    },
    {
      idx: 501,
      type: 'border',
      startPosition: [gap * 12, 0, -100],
      finishedPosition: [0, gap * 3, 0],
      forwardPosition: [gap * 12, 19, -100],
      startDuration: 1.1,
      closedDuration: 1.1,
      forwardDuration: 1.1,
      startDelay: 0.25,
      closedDelay: 0,
      forwardDelay: 0,
      mainText: items[1]?.title,
      subtitle: items[1]?.subtitle,
      subText: items[1]?.description,
      isActive: true,
      startRotation: [-2.5, -5, -0.5],
      finalRotation: [0, 0, 0],
      forwardRotation: [2.5, 5, 0.5],
      ease: "easeInOut"
    },
    {
      idx: 502,
      type: 'border',
      startPosition: [-(gap * 6), 0, -100],
      finishedPosition: [0, -(gap), 0],
      forwardPosition: [-(gap * 6), 19, -100],
      startDuration: 1.1,
      closedDuration: 1.1,
      forwardDuration: 1.1,
      startDelay: 0,
      closedDelay: 0,
      forwardDelay: 0,
      mainText: items[2]?.title,
      subtitle: items[2]?.subtitle,
      subText: items[2]?.description,
      isActive: true,
      startRotation: [3, 1.5, -0.25],
      finalRotation: [0, 0, 0],
      forwardRotation: [1, 3, -0.25],
      ease: "easeInOut"
    },
    {
      idx: 503,
      type: 'border',
      startPosition: [-(gap * 12), -50, 100],
      finishedPosition: [0, -(gap * 3), 0],
      forwardPosition: [-(gap * 12), -19, -100],
      startDuration: 1.1,
      closedDuration: 1.1,
      forwardDuration: 1.1,
      startDelay: 0,
      closedDelay: 0,
      forwardDelay: 0,
      mainText: items[3]?.title,
      subtitle: items[3]?.subtitle,
      subText: items[3]?.description,
      isActive: true,
      startRotation: [2.5, 7, 0.5],
      finalRotation: [0, 0, 0],
      forwardRotation: [-2.5, 7, -0.5],
      ease: "easeInOut"
    },
  ]
};





/////// описуємо анімацію для кожної дошки / альбом
const CreateBoardsDataDec = (gap: number, size: number, left: number, top: number, items: any[], title: string) => {
  size = (size ?? 1) / 2;
  gap = (gap ?? 1) / 2;
  return [
    {
      idx: 499,
      type: 'text',
      fontSize: 3,
      startPosition: [gap, gap * 4, 70],
      finishedPosition: [left + (gap / 2), top + -(gap), 0.5],
      forwardPosition: [left + (gap / 2), top + -(gap), 0.5],
      startDuration: 1.1,
      closedDuration: 1.1,
      forwardDuration: 1.1,
      startDelay: 0.5,
      closedDelay: 0,
      forwardDelay: 0.2,
      mainText: title,
      subtitle: '',
      isActive: true,
      startRotation: [0.0, 0.0, 0.0],
      finalRotation: [0, 0, 0],
      forwardRotation: [0.0, 0.0, 0.0],
      ease: "sine.in"
    },

    {
      idx: 500,
      type: 'border',
      startPosition: [gap * 6, 0, 110],
      finishedPosition: [gap, 0, 0],
      forwardPosition: [gap * 1, 35, -50],
      startDuration: 1.1,
      closedDuration: 1.1,
      forwardDuration: 1.1,
      startDelay: 0.75,
      closedDelay: 0,
      forwardDelay: 0.1,
      mainText: items[0]?.title,
      subtitle: items[0]?.subtitle,
      subText: items[0]?.description,
      isActive: true,
      startRotation: [0, 5, 0],
      finalRotation: [0, 0, 0],
      forwardRotation: [0.9, 0.8, 0.7],
      ease: "easeInOut"
    },
    {
      idx: 501,
      type: 'border',
      startPosition: [gap * 12, 0, -100],
      finishedPosition: [gap * 3, 0, 0],
      forwardPosition: [gap * 12, 19, -100],
      startDuration: 1.1,
      closedDuration: 1.1,
      forwardDuration: 1.1,
      startDelay: 0.75,
      closedDelay: 0,
      forwardDelay: 0,
      mainText: items[1]?.title,
      subtitle: items[1]?.subtitle,
      subText: items[1]?.description,
      isActive: true,
      startRotation: [-2.5, -5, -0.5],
      finalRotation: [0, 0, 0],
      forwardRotation: [2.5, 5, 0.5],
      ease: "easeInOut"
    },
    {
      idx: 502,
      type: 'border',
      startPosition: [-(gap * 6), 0, -200],
      finishedPosition: [-(gap), 0, 0],
      forwardPosition: [-(gap * 6), 19, -110],
      startDuration: 1.1,
      closedDuration: 1.1,
      forwardDuration: 1.1,
      startDelay: 0.5,
      closedDelay: 0,
      forwardDelay: 0,
      mainText: items[2]?.title,
      subtitle: items[2]?.subtitle,
      subText: items[2]?.description,
      isActive: true,
      startRotation: [3, 1.5, -0.25],
      finalRotation: [0, 0, 0],
      forwardRotation: [1, 3, -0.25],
      ease: "easeInOut"
    },
    {
      idx: 503,
      type: 'border',
      startPosition: [-(gap * 12), -50, 100],
      finishedPosition: [-(gap * 3), 0, 0],
      forwardPosition: [-(gap * 12), -19, -100],
      startDuration: 1.1,
      closedDuration: 1.1,
      forwardDuration: 1.1,
      startDelay: 0.5,
      closedDelay: 0,
      forwardDelay: 0,
      mainText: items[3]?.title,
      subtitle: items[3]?.subtitle,
      subText: items[3]?.description,
      isActive: true,
      startRotation: [2.5, 7, 0.5],
      finalRotation: [0, 0, 0],
      forwardRotation: [-2.5, 7, -0.5],
      ease: "easeInOut"
    },
  ]
};


export const SectionFinish2 = React.memo(({ items, sectionName, title }: { items: any[], sectionName: string, title: string }) => {
  const boardsRefs = useRef<(Mesh | null)[]>([]);
  const bounds = useScreenBounds();


  /// збираємо пресет під дисплей
  const [animatedData, boardWidth, boardHeight,
    correctionMainTextY, correctionSubTextY, mainFontSize, subFontSize
  ] = useMemo(() => {
    const vmin = (bounds.width > bounds.height) ? bounds.height : bounds.width;

    if (bounds.height > bounds.width) {
      const boardWidth = bounds.width / 2;
      const boardHeight = bounds.height / 6;
      const gap = boardHeight + (vmin / 95);

      return [ /// mob
        CreateBoardsDataMob(gap, boardHeight, bounds.left, bounds.top, items, title), boardWidth, boardHeight,
        boardHeight / 3, boardHeight / 6.5, boardHeight / 15, boardHeight / 25,
      ];
    } else {
      const boardWidth = bounds.width / 5;
      const boardHeight = bounds.width / 5;
      const gap = boardWidth + (vmin / 35);
      return [ ///dec
        CreateBoardsDataDec(gap, boardWidth, bounds.left, bounds.top, items, title),
        boardWidth, boardHeight,
        boardWidth / 3, boardWidth / 6.5, boardWidth / 15, boardWidth / 25,
      ];
    }

  }, [bounds, items, title]);


  const opacitiesRef = useRef<{ value: number }[]>(
    animatedData.map(() => ({ value: 0 }))
  );
  const [, forceUpdate] = useState({});


  /// реєструємо анімації в глобальному контролері
  useEffect(function () {
    const data: AnimationData = {
      [`section ${sectionName} open`]: [],
      [`section ${sectionName} closed`]: [],
      [`section ${sectionName} forward`]: []
    }

    boardsRefs.current.forEach((mesh, i) => {
      if (!mesh) return;

      const { startPosition, finishedPosition, forwardPosition, startRotation, finalRotation, forwardRotation, startDuration, closedDuration, forwardDuration, startDelay, closedDelay, forwardDelay, ease } = animatedData[i];

      mesh.position.x = startPosition[0];
      mesh.position.y = startPosition[1];
      mesh.position.z = startPosition[2];

      mesh.rotation.x = startRotation[0];
      mesh.rotation.y = startRotation[1];
      mesh.rotation.z = startRotation[2];

      mesh.visible = false;

      data[`section ${sectionName} open`].push(
        ['call', () => {
          mesh.visible = true;
          // Reset to start position before animating
          mesh.position.set(startPosition[0], startPosition[1], startPosition[2]);
          mesh.rotation.set(startRotation[0], startRotation[1], startRotation[2]);
          opacitiesRef.current[i].value = 0;
          forceUpdate({});
        }, 0, 0],
        [
          'to',
          mesh.position,
          {
            x: finishedPosition[0],
            y: finishedPosition[1],
            z: finishedPosition[2],
            duration: startDuration,
            ease: ease,

          },
          startDelay

        ]
      );

      data[`section ${sectionName} open`].push([
        'to',
        mesh.rotation,
        {
          x: finalRotation[0],
          y: finalRotation[1],
          z: finalRotation[2],
          duration: startDuration,
          ease: ease,

        },
        startDelay
      ]
      );


      data[`section ${sectionName} open`].push([
        'to',
        opacitiesRef.current[i],
        {
          value: 1,
          duration: startDuration,
          ease: ease,
          onUpdate: () => forceUpdate({}),
        },
        startDelay
      ]);


      data[`section ${sectionName} closed`].push([
        'to',
        mesh.rotation,
        {
          x: startRotation[0],
          y: startRotation[1],
          z: startRotation[2],
          duration: closedDuration,
          ease: ease,

        },
        closedDelay
      ]);


      data[`section ${sectionName} closed`].push([
        'to',
        mesh.position,
        {
          x: startPosition[0],
          y: startPosition[1],
          z: startPosition[2],
          duration: closedDuration,
          onComplete: () => {
            mesh.visible = false;
          },
          ease: ease,

        },
        closedDelay

      ]);


      data[`section ${sectionName} closed`].push([
        'to',
        opacitiesRef.current[i],
        {
          value: 0,
          duration: closedDuration,
          ease: ease,
          onUpdate: () => forceUpdate({}),
        },
        closedDelay
      ]);



      data[`section ${sectionName} forward`].push([
        'to',
        mesh.rotation,
        {
          x: forwardRotation[0],
          y: forwardRotation[1],
          z: forwardRotation[2],
          duration: forwardDuration,
          ease: ease,

        },
        forwardDelay
      ]
      );

      data[`section ${sectionName} forward`].push([
        'to',
        mesh.position,
        {
          x: forwardPosition[0],
          y: forwardPosition[1],
          z: forwardPosition[2],
          duration: forwardDuration,
          onComplete: () => {
            mesh.visible = false;
          },
          ease: ease,
        }
        ,
        forwardDelay

      ]
      );

      data[`section ${sectionName} forward`].push([
        'to',
        opacitiesRef.current[i],
        {
          value: 0,
          duration: forwardDuration,
          ease: ease,
          onUpdate: () => forceUpdate({}),
        },
        forwardDelay
      ]);

    });
    AnimationController.register(data);

    return () => {
      AnimationController.remove(`section ${sectionName} open`);
      AnimationController.remove(`section ${sectionName} closed`);
      AnimationController.remove(`section ${sectionName} forward`);
    };
  }, [bounds, sectionName, animatedData, title]);


  return (
    <group>

      {animatedData.map(({ idx, mainText, subText, subtitle, isActive, fontSize, type }, i) => {
        if (type === 'text') return <Text
          key={idx}
          ref={(el: Mesh | null) => { boardsRefs.current[i] = el; }}
          font="/fonts/Poppins-Medium.ttf"
          color="white"
          fontSize={fontSize}
          anchorY="middle"
          textAlign="center"
          fillOpacity={opacitiesRef.current[i].value}
          anchorX="left"
        >
          {mainText}
        </Text>

        else if (type === 'border') return <Board
          key={idx}
          ref={(el: Mesh | null) => { boardsRefs.current[i] = el; }}
          idx={idx}
          boardWidth={boardWidth}
          boardHeight={boardHeight}
          boardDepth={0.01}
          mainText={mainText}
          subText={subText}
          subtitle={subtitle}
          handleToggle={() => { }}
          isActive={isActive}
          correctionMainTextY={correctionMainTextY}
          correctionSubTextY={correctionSubTextY}
          mainFontSize={mainFontSize}
          subFontSize={subFontSize}
          anchorY="top"
          opacity={opacitiesRef.current[i].value}
        />
        else console.error('Unknown type in animatedData', type);

      })}

    </group>
  );
});



SectionFinish2.displayName = "SectionFinish2";