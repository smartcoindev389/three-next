import { useEffect, useRef, useState } from "react";
import { Board } from "shared/components/(main)/ThreeScene/Board";
import { BoardGroupProps, LayoutMode } from "@/types";
import gsap from "gsap";
import { Group } from "three";
import { Person } from "../Person";
import { useDoubleScrollDirection } from "@/hooks/use-double-scroll-direction";

export const BoardGroup = function BoardGroup({
  boards, // Масив об'єктів дощечок з їх даними (позиції, стан активності тощо)
  boardHeight, // Висота дощечки в 3D просторі
  boardWidth, // Ширина дощечки в 3D просторі
  handleToggle, // Функція-обробник кліку на дощечку (зміна стану активності)
  gradientMaterial, // Функція для створення градієнтного матеріалу дощечки
  glowMaterial, // Функція для створення світлового ефекту (glow) дощечки
  edgeActiveColor, // Колір краю активної дощечки
  edgeColor, // Колір краю неактивної дощечки
  glowBoxScaleX, // Масштаб світлового ефекту по осі X
  glowBoxScaleY, // Масштаб світлового ефекту по осі Y
  glowBoxScaleZ, // Масштаб світлового ефекту по осі Z
  layoutMode = "grid", // Режим розташування дощечок (grid, checkerboard, circle, spiral, random)
  gridCols = 3, // Кількість колонок в сітці (для режимів grid та інших)
  gridRows = 2, // Кількість рядків в сітці (для режимів grid та інших)
  spacing = { x: 3, y: 3 }, // Відстань між дощечками по осях X та Y
  randomOffset = { x: 0.5, y: 0.5 }, // Випадкове зміщення позицій для створення природного вигляду
  checkerboardCols1 = 3, // Кількість колонок в першому ряду шахматного розташування
  checkerboardCols2 = 2, // Кількість колонок в другому ряду шахматного розташування
  triggerAnimation = false, // Тригер для запуску анімації збирання дощечок
  onAnimationComplete, // Callback функція яка викликається після завершення анімації
  mainFontSize,
  subFontSize,
  showReadMore,
  shouldScatter = false, // Тригер для розліту дощечок
}: BoardGroupProps) {
  const groupRefs = useRef<(Group | null)[]>([]);
  const levitationTimelines = useRef<Array<gsap.core.Tween | undefined>>([]);
  const animationStarted = useRef(false);
  const prevTargetPositions = useRef<[number, number, number][]>([]);
  const isScattered = useRef(false);
  const scatterTimelines = useRef<Array<gsap.core.Tween | undefined>>([]);
  const animatedEntryStarted = useRef(false);
  const targetPositions = useRef<[number, number, number][]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollTimelines = useRef<Array<gsap.core.Tween | undefined>>([]);

  useDoubleScrollDirection({
    onScroll(deltaY) {
      if (layoutMode === "animated-entry") {
        // Оновлюємо прогрес скролу (нормалізуємо deltaY)
        setScrollProgress((prev) => {
          let next = prev + deltaY / 7500; // 1000 - чутливість
          next = Math.max(0, Math.min(1, next)); // обмежуємо від 0 до 1
          return next;
        });
      }
    },
  });

  // Функція для обчислення позицій залежно від режиму
  const calculatePositions = (mode: LayoutMode): [number, number, number][] => {
    const positions: [number, number, number][] = [];
    console.log("🎯 Розрахунок позицій для режиму:", mode);
    switch (mode) {
      // РЕЖИМ "grid-fixed" - використовуємо позиції з board.position
      case "grid-fixed": {
        boards.forEach((board) => {
          positions.push([
            board.position[0],
            board.position[1],
            board.position[2],
          ]);
        });
        break;
      }
      // РЕЖИМ "animated-entry" - використовуємо фінальні позиції з board.finalPosition
      case "animated-entry": {
        boards.forEach((board) => {
          if (board.finalPosition) {
            positions.push(board.finalPosition);
          } else {
            positions.push([
              board.position[0],
              board.position[1],
              board.position[2],
            ]);
          }
        });
        break;
      }

      // РЕЖИМ "grid" - використовуємо сітку
      case "grid": {
        boards.forEach((_, i) => {
          const row = Math.floor(i / gridCols);
          const col = i % gridCols;
          const x = (col - (gridCols - 1) / 2) * spacing.x;
          const y = -row * spacing.y; // ← ЗМІНЕНО: почнти з 0 і йти вниз
          positions.push([x, y, 0]);
        });
        break;
      }

      // РЕЖИМ "шахматна сітка" - використовуємо шахматне розташування
      case "checkerboard": {
        let currentIndex = 0;
        let currentRow = 0;

        while (currentIndex < boards.length) {
          const isEvenRow = currentRow % 2 === 0;
          const colsInRow = isEvenRow ? checkerboardCols1 : checkerboardCols2;

          for (
            let col = 0;
            col < colsInRow && currentIndex < boards.length;
            col++
          ) {
            const maxCols = Math.max(checkerboardCols1, checkerboardCols2);
            const offsetForCentering = (maxCols - colsInRow) * spacing.x * 0.5;
            const checkerboardOffset = isEvenRow ? 0 : -spacing.x * 0.5;
            const randomUpOffset = Math.random() * spacing.y * 0.3;

            const x =
              (col - (colsInRow - 1) / 2) * spacing.x +
              offsetForCentering +
              checkerboardOffset +
              (Math.random() - 0.5) * randomOffset.x;
            const y =
              -currentRow * spacing.y +
              randomUpOffset +
              (Math.random() - 0.5) * randomOffset.y;

            positions.push([x, y, 0]);
            currentIndex++;
          }
          currentRow++;
        }
        break;
      }

      // РЕЖИМ "випадковий" - використовуємо випадкові позиції
      case "random": {
        const maxX = gridCols * spacing.x * 0.5;
        const maxY = gridRows * spacing.y * 0.5;
        boards.forEach(() => {
          const x =
            (Math.random() - 0.5) * maxX * 2 +
            (Math.random() - 0.5) * randomOffset.x;
          const y =
            (Math.random() - 0.5) * maxY * 2 +
            (Math.random() - 0.5) * randomOffset.y;
          positions.push([x, y, 0]);
        });
        break;
      }

      // РЕЖИМ "коло" - використовуємо коло
      default: {
        boards.forEach((_, i) => {
          const row = Math.floor(i / gridCols);
          const col = i % gridCols;
          const x = (col - (gridCols - 1) / 2) * spacing.x;
          const y = -(row - (gridRows - 1) / 2) * spacing.y;
          positions.push([x, y, 0]);
        });
        break;
      }
    }

    return positions;
  };

  // Генеруємо стартову позицію для різних режимів
  const initialTransforms = useRef(
    boards.map((board) => {
      if (layoutMode === "animated-entry") {
        // Для animated-entry використовуємо початкову позицію з board.position
        return {
          position: board.position,
          rotation: [0, 0, 0] as [number, number, number],
        };
      } else {
        // Для інших режимів - рандомні позиції
        return {
          position: [
            (Math.random() > 0.5 ? 1 : -1) * (30 + Math.random() * 20),
            (Math.random() > 0.5 ? 1 : -1) * (30 + Math.random() * 20),
            (Math.random() > 0.5 ? 1 : -1) * (30 + Math.random() * 20),
          ] as [number, number, number],
          rotation: [
            Math.random() * Math.PI * 4 + Math.PI * 2,
            Math.random() * Math.PI * 4 + Math.PI * 2,
            Math.random() * Math.PI * 4 + Math.PI * 2,
          ] as [number, number, number],
        };
      }
    }),
  );

  // Функція для запуску анімації animated-entry (З ЗАТРИМКОЮ І ДУЖЕ ПОВІЛЬНИМ РУХОМ)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const startEntryAnimation = () => {
    if (animatedEntryStarted.current) return;
    animatedEntryStarted.current = true;
    let completed = 0;
    const total = boards.length;

    boards.forEach((board, i) => {
      const ref = groupRefs.current[i];
      if (ref && board && board.finalPosition) {
        const finalPos = board.finalPosition;

        const opacityObj = { value: 0 };
        gsap.to(opacityObj, {
          value: 1,
          duration: 1.0,
          ease: "power2.inOut",
          delay: i * 0.15,
          onUpdate: function () {
            setBoardOpacities((prev) => {
              const newOpacities = [...prev];
              newOpacities[i] = opacityObj.value;
              return newOpacities;
            });
          },
          onComplete: () => {
            // console.log(`👁️ Дощечка ${i} з'явилася, чекаємо перед рухом...`);
          },
        });

        // Анімація руху до фінальної позиції
        gsap.to(ref.position, {
          x: finalPos[0],
          y: finalPos[1],
          z: finalPos[2],
          duration: 8.0 + Math.random() * 4.0,
          ease: "power1.out",
          delay: i * 0.15 + 0.5,
          onStart: () => {},
          onComplete: () => {
            completed++;
            if (
              completed === total &&
              typeof onAllBoardsArrived === "function"
            ) {
              onAllBoardsArrived();
            }
          },
        });

        // ЗАЛИШАЄМО ОБЕРТАННЯ НА 0
        ref.rotation.set(0, 0, 0);
      }
    });
  };

  // Додаємо функцію для руху дощечок по Z через скрол з GSAP
  const moveByScroll = () => {
    boards.forEach((board, i) => {
      const ref = groupRefs.current[i];
      if (ref && board.finalPosition) {
        // Стартова позиція (з board.position - це реальна стартова позиція)
        const startPos = board.position;
        // Фінішна позиція (з board.finalPosition)
        const finalPos = board.finalPosition;

        // Розраховуємо відстань між стартом і фінішем
        const totalDistance = Math.sqrt(
          Math.pow(finalPos[0] - startPos[0], 2) +
            Math.pow(finalPos[1] - startPos[1], 2) +
            Math.pow(finalPos[2] - startPos[2], 2),
        );

        // Нормалізуємо відстань для розрахунку швидкості (дальші - повільніше)
        const maxDistance = 100; // максимальна очікувана відстань
        const distanceFactor = Math.min(totalDistance / maxDistance, 1);

        // Швидкість руху залежно від відстані (дальші дощечки рухаються повільніше)
        const speedFactor = 1 - distanceFactor * 0.7; // від 0.3 до 1.0
        const adjustedProgress = Math.pow(scrollProgress, 2 - speedFactor); // більш складна крива

        // Кубічна ease-out крива для плавного руху
        const easedProgress =
          adjustedProgress < 0.5
            ? 4 * adjustedProgress * adjustedProgress * adjustedProgress
            : 1 - Math.pow(-2 * adjustedProgress + 2, 3) / 2;

        // Додаємо ефект "резинки" - близькі дощечки рухаються швидше
        const rubberBandEffect = 1 + (1 - distanceFactor) * 0.3; // від 1.0 до 1.3
        const targetPos = [
          startPos[0] +
            (finalPos[0] - startPos[0]) * easedProgress * rubberBandEffect,
          startPos[1] +
            (finalPos[1] - startPos[1]) * easedProgress * rubberBandEffect,
          startPos[2] +
            (finalPos[2] - startPos[2]) * easedProgress * rubberBandEffect,
        ];

        // Якщо резинка "перетягнулась", обмежуємо позицію
        const finalTargetPos = [
          Math.abs(targetPos[0] - startPos[0]) >
          Math.abs(finalPos[0] - startPos[0])
            ? finalPos[0]
            : targetPos[0],
          Math.abs(targetPos[1] - startPos[1]) >
          Math.abs(finalPos[1] - startPos[1])
            ? finalPos[1]
            : targetPos[1],
          Math.abs(targetPos[2] - startPos[2]) >
          Math.abs(finalPos[2] - startPos[2])
            ? finalPos[2]
            : targetPos[2],
        ];

        // Зупиняємо попередню анімацію, якщо вона є
        if (scrollTimelines.current[i]) {
          scrollTimelines.current[i]?.kill();
        }

        // Використовуємо GSAP для плавного руху до цільової позиції
        scrollTimelines.current[i] = gsap.to(ref.position, {
          x: finalTargetPos[0],
          y: finalTargetPos[1],
          z: finalTargetPos[2],
          duration: 0.6, // швидкість адаптації до нової позиції
          ease: "power2.out", // плавна ease-out крива
          overwrite: true, // перезаписуємо попередні анімації
        });

        // Анімація обертання з GSAP
        const rotationIntensity = 0.05 * (1 - distanceFactor);
        gsap.to(ref.rotation, {
          x: Math.sin(scrollProgress * Math.PI + i * 0.2) * rotationIntensity,
          y: Math.cos(scrollProgress * Math.PI + i * 0.3) * rotationIntensity,
          z:
            Math.sin(scrollProgress * Math.PI * 0.5 + i * 0.4) *
            rotationIntensity *
            0.5,
          duration: 0.4,
          ease: "power1.out",
          overwrite: true,
        });

        // ПРОЗОРІСТЬ залишається без змін
        let opacity = 0;
        const closeBoards = Math.ceil(boards.length * 0.3);

        if (distanceFactor <= 0.3 || i < closeBoards) {
          opacity = 1;
        } else {
          const distanceThreshold = distanceFactor * 0.5;
          const appearanceStart = Math.max(0.3, distanceThreshold);
          const appearanceEnd = appearanceStart + 0.15;

          if (scrollProgress > appearanceStart) {
            if (scrollProgress >= appearanceEnd) {
              opacity = 1;
            } else {
              const localProgress =
                (scrollProgress - appearanceStart) /
                (appearanceEnd - appearanceStart);
              opacity = Math.pow(localProgress, 0.3);
            }
          }
        }

        // Оновлюємо прозорість
        setBoardOpacities((prev) => {
          const newOpacities = [...prev];
          newOpacities[i] = opacity;
          return newOpacities;
        });
      }
    });
  };

  const onAllBoardsArrived = () => {
    document.body.style.overflow = "";
  };

  // Функція для запуску анімації збирання
  const startAssemblyAnimation = () => {
    if (animationStarted.current) return;
    animationStarted.current = true;

    let completedAnimations = 0;
    const totalAnimations = boards.length;

    boards.forEach((board, i) => {
      const ref = groupRefs.current[i];
      if (ref) {
        const targetPos = targetPositions.current[i];

        // ПОКАЗУЄМО дощечки на початку анімації
        ref.scale.set(1, 1, 1);

        gsap.to(ref.position, {
          x: targetPos[0],
          y: targetPos[1],
          z: targetPos[2],
          duration: 2 + Math.random() * 0.7,
          ease: "power3.out",
          delay: i * 0.08,
          onComplete: () => {
            completedAnimations++;

            // Після досягнення цільової позиції запускаємо легку левітацію
            const levitationTween = gsap.to(ref.position, {
              x: targetPos[0] + Math.sin(i * 0.3) * 0.08 + 0.03,
              y: targetPos[1] + Math.sin(i * 0.5) * 0.1 + 0.05,
              duration: 3 + Math.random() * 1,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              delay: Math.random() * 2,
            });
            levitationTimelines.current[i] = levitationTween;

            // Викликаємо callback після завершення всіх анімацій
            if (
              completedAnimations === totalAnimations &&
              onAnimationComplete
            ) {
              onAnimationComplete();
            }
          },
        });

        gsap.to(ref.rotation, {
          x: 0,
          y: 0,
          z: 0,
          duration: 2 + Math.random() * 0.7,
          ease: "power3.out",
          delay: i * 0.08,
        });
      }
    });
  };

  // Функція для розліту дощечок на випадкові позиції з легким обертанням
  const scatterBoards = () => {
    if (isScattered.current) return;
    isScattered.current = true;

    boards.forEach((board, i) => {
      const ref = groupRefs.current[i];
      if (ref) {
        // Зупиняємо левітацію
        if (levitationTimelines.current[i]) {
          levitationTimelines.current[i]?.kill();
        }

        // Генеруємо випадкові позиції для розліту
        const scatterX = ref.position.x - 5;
        const scatterY = ref.position.y + 7;
        const scatterZ = 10;

        // Анімація розліту
        const scatterTween = gsap.to(ref.position, {
          x: scatterX,
          y: scatterY,
          z: scatterZ,
          duration: 2,
          ease: "power2.out",
          delay: i * 0.05,
        });

        scatterTimelines.current[i] = scatterTween;
      }
    });
  };

  // Додаємо useEffect для виклику moveByScroll при зміні scrollProgress
  useEffect(() => {
    if (layoutMode === "animated-entry") {
      moveByScroll();
    }
  }, [scrollProgress, layoutMode]);

  useEffect(() => {
    console.log("🔄 Оновлення targetPositions через зміну layoutMode");
    targetPositions.current = calculatePositions(layoutMode);
  }, [layoutMode]);

  useEffect(() => {
    // Зберігаємо поточні цільові позиції для наступного порівняння
    prevTargetPositions.current = [...targetPositions.current];

    return () => {
      // Очищуємо всі таймлайни левітації при розмонтуванні
      levitationTimelines.current.forEach((timeline) => {
        if (timeline) timeline.kill();
      });
      // Очищуємо таймлайни розліту
      scatterTimelines.current.forEach((timeline) => {
        if (timeline) timeline.kill();
      });
    };
  }, []);

  useEffect(() => {
    if (triggerAnimation) {
      if (layoutMode === "animated-entry") {
        console.log("🚀 Запускаємо animated-entry");
        // startEntryAnimation();
      } else if (!animationStarted.current) {
        console.log("🚀 Запускаємо звичайну анімацію");
        startAssemblyAnimation();
      }
    }
  }, [triggerAnimation, layoutMode]);

  useEffect(() => {
    boards.forEach((board, i) => {
      const ref = groupRefs.current[i];
      if (ref) {
        if (layoutMode === "animated-entry") {
          ref.position.set(...board.position);
          ref.rotation.set(0, 0, 0);
          setBoardOpacities(boards.map(() => 0));
          // ref.scale.set(0, 0, 0);
        } else if (!animationStarted.current) {
          // Для інших режимів - рандомні позиції
          ref.position.set(...initialTransforms.current[i].position);
          ref.rotation.set(...initialTransforms.current[i].rotation);
          ref.scale.set(0, 0, 0); // ТАКОЖ ПРИХОВАНІ
        }
      }
    });
  }, []);

  useEffect(() => {
    const isAnyAnimationStarted =
      animationStarted.current || animatedEntryStarted.current;

    if (shouldScatter && isAnyAnimationStarted) {
      scatterBoards();
      console.log("🎆 Радіальний розліт активовано");
    }
  }, [shouldScatter]);

  const [boardOpacities, setBoardOpacities] = useState<number[]>(
    boards.map(() => (layoutMode === "animated-entry" ? 0 : 1)),
  );

  return (
    <>
      {boards.map((board, i) => (
        <group
          key={board.id ?? `board-${i}`}
          ref={(el) => (groupRefs.current[i] = el)}
        >
          {board.type !== "person" && (
            <Board
              {...board}
              isActive={board.isActive ?? false}
              position={[0, 0, 0]}
              idx={i}
              boardHeight={boardHeight}
              boardWidth={boardWidth}
              handleToggle={handleToggle}
              gradientMaterial={gradientMaterial}
              glowMaterial={glowMaterial}
              edgeActiveColor={edgeActiveColor}
              edgeColor={edgeColor}
              glowBoxScaleX={glowBoxScaleX}
              glowBoxScaleY={glowBoxScaleY}
              glowBoxScaleZ={glowBoxScaleZ}
              mainFontSize={mainFontSize}
              subFontSize={subFontSize}
              showReadMore={showReadMore}
              opacity={boardOpacities[i]}
            />
          )}
          {board.type === "person" && board.personProps && (
            <Person opacity={boardOpacities[i]} {...board.personProps} />
          )}
        </group>
      ))}
    </>
  );
};
