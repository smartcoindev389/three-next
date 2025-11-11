/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState, useCallback } from "react";
import { Group } from "three";
import gsap from "gsap";
import { useDoubleScrollDirection } from "@/hooks/use-double-scroll-direction";
import {
  getInitialValuesFromSteps,
  animationGroups,
} from "@/screens/about/animation";
import {
  AnimateFromScrollProps,
  AnimationState,
  Vector3,
  AnimationProperty,
} from "./types";

const AnimateFromScroll: React.FC<AnimateFromScrollProps> = ({
  children,
  steps,
  scrollSettings = {},
  callbacks = {},
  getGroupForStep,
  debug = false,
}) => {
  const elementRefs = useRef<(Group | null)[]>([]);
  const [, setCompletedSteps] = useState(new Set<number>()); // Відстежуємо завершені кроки
  const [currentRenderGroup, setCurrentRenderGroup] = useState<
    number | string | null
  >(null); // Поточна група для рендерингу
  const [isAnimationActive, setIsAnimationActive] = useState(false); // Чи активна анімація
  const currentGroupRef = useRef<number | string | null>(null); // Відстежуємо поточну групу
  const elementInitialStates = useRef<
    Map<
      number,
      {
        position: Vector3;
        rotation: Vector3;
        scale: Vector3;
        opacity: number;
      }
    >
  >(new Map()); // Збереження початкових станів елементів

  const animationStateRef = useRef<AnimationState>({
    currentStep: -1, // Ініціалізуємо як -1, щоб перший крок (0) викликав onStepStart
    progress: 0,
    totalProgress: 0,
    direction: "down",
    isAnimating: false,
  });

  // Генеруємо унікальний ID для кожного компонента
  const componentId = useRef(Math.random().toString(36).substr(2, 9));

  const {
    sensitivity = 0.0005,
    minDelta = 0.01,
    snapThreshold = 0.8,
  } = scrollSettings;

  const {
    onAnimationStart,
    onAnimationEnd,
    onStepStart,
    onStepEnd,
    onProgress,
    onGroupChange,
  } = callbacks;

  // Функція для отримання значення властивості з кроку
  const getPropertyValue = useCallback(
    <T,>(
      property: AnimationProperty<T> | T | undefined,
      isFrom: boolean = true,
    ): T | undefined => {
      if (!property) return undefined;

      if (
        typeof property === "object" &&
        "from" in property &&
        "to" in property
      ) {
        return isFrom ? property.from : property.to;
      }

      return property as T;
    },
    [],
  );

  // Функція для отримання animationRange з властивості
  const getAnimationRange = useCallback(
    <T,>(property: AnimationProperty<T> | T | undefined): number => {
      if (!property) return 1.0; // За замовчуванням 100% кроку

      if (typeof property === "object" && "animationRange" in property) {
        return (property as AnimationProperty<T>).animationRange || 1.0;
      }

      return 1.0; // За замовчуванням 100% кроку
    },
    [],
  );

  // Функція для обчислення локального прогресу з урахуванням animationRange
  const calculateLocalProgress = useCallback(
    (globalProgress: number, animationRange: number): number => {
      // Якщо animationRange = 0.3, то анімація виконується за перші 30% кроку
      if (globalProgress <= animationRange) {
        return globalProgress / animationRange; // Масштабуємо до 0-1
      }
      return 1.0; // Анімація завершена
    },
    [],
  );

  // Функція для інтерполяції між значеннями
  const interpolateVector3 = useCallback(
    (from: Vector3, to: Vector3, t: number): Vector3 => {
      return [
        from[0] + (to[0] - from[0]) * t,
        from[1] + (to[1] - from[1]) * t,
        from[2] + (to[2] - from[2]) * t,
      ];
    },
    [],
  );

  const interpolateNumber = useCallback(
    (from: number, to: number, t: number): number => {
      return from + (to - from) * t;
    },
    [],
  );

  // Функція для збереження початкових станів елементів
  const saveElementInitialState = useCallback(
    (elementIndex: number, child: Group) => {
      if (!elementInitialStates.current.has(elementIndex)) {
        elementInitialStates.current.set(elementIndex, {
          position: [child.position.x, child.position.y, child.position.z],
          rotation: [child.rotation.x, child.rotation.y, child.rotation.z],
          scale: [child.scale.x, child.scale.y, child.scale.z],
          opacity: child.userData.opacity || 1,
        });
      }
    },
    [],
  );

  // Функція для визначення групи за глобальним індексом елемента
  const getElementGroup = useCallback((globalIndex: number) => {
    let currentIndex = 0;

    for (const animationGroup of animationGroups) {
      const groupSize = animationGroup.data.length;
      if (
        globalIndex >= currentIndex &&
        globalIndex < currentIndex + groupSize
      ) {
        return animationGroup.name;
      }
      currentIndex += groupSize;
    }

    return null;
  }, []);

  // Функція для перетворення глобального індексу на локальний в межах групи
  const getLocalElementIndex = useCallback(
    (groupName: string | number | null, globalIndex: number) => {
      let currentIndex = 0;

      for (const animationGroup of animationGroups) {
        const groupSize = animationGroup.data.length;
        if (animationGroup.name === groupName) {
          return globalIndex - currentIndex;
        }
        currentIndex += groupSize;
      }

      return 0;
    },
    [],
  );

  // Функція для пошуку глобального індексу елементу
  const findGlobalElementIndex = useCallback(
    (currentGroup: string | number | null, localElementIndex: number) => {
      if (!getGroupForStep) return localElementIndex;

      // Якщо елементи рендеряться плоско (всі елементи всіх груп в одному масиві)
      // то нам потрібно знайти початковий індекс поточної групи
      let globalStartIndex = 0;

      if (debug) {
        console.log(
          `🔍 Шукаємо глобальний індекс для групи ${currentGroup}, локальний індекс ${localElementIndex}`,
        );
      }

      // Проходимо по всім групам в порядку їх появи та рахуємо елементи
      for (const animationGroup of animationGroups) {
        if (debug) {
          console.log(
            `📊 Група ${animationGroup.name}: початковий індекс ${globalStartIndex}, розмір ${animationGroup.data.length}`,
          );
        }

        if (animationGroup.name === currentGroup) {
          // Знайшли потрібну групу, повертаємо її початковий індекс + локальний індекс
          const result = globalStartIndex + localElementIndex;
          if (debug) {
            console.log(
              `✅ Знайдено групу ${currentGroup}: глобальний індекс ${result}`,
            );
          }
          return result;
        }
        // Додаємо кількість елементів цієї групи до загального лічильника
        globalStartIndex += animationGroup.data.length;
      }

      // Якщо групу не знайдено, повертаємо локальний індекс
      if (debug) {
        console.log(
          `❌ Група ${currentGroup} не знайдена, повертаємо локальний індекс ${localElementIndex}`,
        );
      }
      return localElementIndex;
    },
    [getGroupForStep, debug],
  );

  // Функція для виконання анімації кроку
  const animateStep = useCallback(
    (stepIndex: number, progress: number, direction: "up" | "down") => {
      const step = steps[stepIndex];
      if (!step) return;

      // Визначаємо поточну групу
      const currentGroup = getGroupForStep ? getGroupForStep(stepIndex) : null;

      // Оновлюємо поточну групу без скидання елементів
      if (currentGroup !== currentGroupRef.current) {
        currentGroupRef.current = currentGroup;
        setCurrentRenderGroup(currentGroup);

        // Викликаємо callback для зміни групи
        if (onGroupChange) {
          onGroupChange(stepIndex, direction);
        }
      }

      // Приховуємо елементи інших груп, але НЕ приховуємо елементи поточної групи
      elementRefs.current.forEach((element, index) => {
        if (element instanceof Group) {
          // Визначаємо, до якої групи належить цей елемент
          const elementGroup = getElementGroup(index);

          if (debug) {
            console.log(
              `🔍 Елемент ${index}: група ${elementGroup}, поточна група ${currentGroup}`,
            );
          }

          // Якщо елемент не належить до поточної групи, приховуємо його
          if (elementGroup !== currentGroup) {
            gsap.to(element.userData, {
              opacity: 0,
              duration: 0.1,
              ease: "linear",
              overwrite: true,
            });
          }
        }
      });

      // Виконуємо анімацію для елементів поточної групи
      const shouldCompleteAnimation =
        progress >= snapThreshold || progress >= 1.0;

      // Анімація персональних елементів
      if (step.elements && step.elements.length > 0) {
        step.elements.forEach((elementAnim) => {
          // Знаходимо глобальний індекс елемента
          const globalIndex = findGlobalElementIndex(
            currentGroup,
            elementAnim.elementIndex,
          );
          const childGroup = elementRefs.current[globalIndex];

          if (debug) {
            console.log(`🔍 Пошук елемента:`, {
              currentGroup,
              localIndex: elementAnim.elementIndex,
              globalIndex,
              totalElements: elementRefs.current.length,
              elementFound: !!childGroup,
              elementGroup: childGroup
                ? getElementGroup(globalIndex)
                : "не знайдено",
            });
          }

          if (!childGroup) {
            if (debug) {
              console.log(
                `❌ Не знайдено елемент для локального індексу ${elementAnim.elementIndex} (глобальний ${globalIndex})`,
              );
              console.log(
                `📊 Доступні елементи:`,
                elementRefs.current.map((el, i) => ({
                  index: i,
                  element: el?.constructor.name || "null",
                })),
              );
            }
            return;
          }

          // Отримуємо значення для анімації елемента
          const elementFromPosition = getPropertyValue(
            elementAnim.position,
            true,
          );
          const elementToPosition = getPropertyValue(
            elementAnim.position,
            false,
          );
          const elementFromRotation = getPropertyValue(
            elementAnim.rotation,
            true,
          );
          const elementToRotation = getPropertyValue(
            elementAnim.rotation,
            false,
          );
          const elementFromScale = getPropertyValue(elementAnim.scale, true);
          const elementToScale = getPropertyValue(elementAnim.scale, false);

          // Отримуємо параметри анімації для елемента
          const elementDuration = elementAnim.duration || 0.5;
          const elementEase = elementAnim.ease || "linear";

          // Встановлюємо position елемента через GSAP
          if (elementFromPosition && elementToPosition) {
            const positionRange = getAnimationRange(elementAnim.position);
            const localProgress = calculateLocalProgress(
              progress,
              positionRange,
            );
            const targetPosition =
              shouldCompleteAnimation || localProgress >= 1.0
                ? elementToPosition
                : interpolateVector3(
                    elementFromPosition,
                    elementToPosition,
                    localProgress,
                  );

            gsap.to(childGroup.position, {
              x: targetPosition[0],
              y: targetPosition[1],
              z: targetPosition[2],
              duration: elementDuration,
              ease: elementEase,
              overwrite: true,
            });
          }

          // Встановлюємо rotation елемента через GSAP
          if (elementFromRotation && elementToRotation) {
            const rotationRange = getAnimationRange(elementAnim.rotation);
            const localProgress = calculateLocalProgress(
              progress,
              rotationRange,
            );
            const targetRotation =
              shouldCompleteAnimation || localProgress >= 1.0
                ? elementToRotation
                : interpolateVector3(
                    elementFromRotation,
                    elementToRotation,
                    localProgress,
                  );

            gsap.to(childGroup.rotation, {
              x: targetRotation[0],
              y: targetRotation[1],
              z: targetRotation[2],
              duration: elementDuration,
              ease: elementEase,
              overwrite: true,
            });
          }

          // Встановлюємо scale елемента через GSAP
          if (elementFromScale && elementToScale) {
            const scaleRange = getAnimationRange(elementAnim.scale);
            const localProgress = calculateLocalProgress(progress, scaleRange);
            const targetScale =
              shouldCompleteAnimation || localProgress >= 1.0
                ? elementToScale
                : interpolateVector3(
                    elementFromScale,
                    elementToScale,
                    localProgress,
                  );

            gsap.to(childGroup.scale, {
              x: targetScale[0],
              y: targetScale[1],
              z: targetScale[2],
              duration: elementDuration,
              ease: elementEase,
              overwrite: true,
            });
          }

          // Встановлюємо opacity елемента через GSAP для плавної анімації
          const elementFromOpacity = getPropertyValue(
            elementAnim.opacity,
            true,
          );
          const elementToOpacity = getPropertyValue(elementAnim.opacity, false);

          if (
            elementFromOpacity !== undefined &&
            elementToOpacity !== undefined
          ) {
            const opacityRange = getAnimationRange(elementAnim.opacity);
            const localProgress = calculateLocalProgress(
              progress,
              opacityRange,
            );
            const targetOpacity =
              shouldCompleteAnimation || localProgress >= 1.0
                ? elementToOpacity
                : interpolateNumber(
                    elementFromOpacity,
                    elementToOpacity,
                    localProgress,
                  );

            // Використовуємо GSAP для плавної анімації opacity
            gsap.to(childGroup.userData, {
              opacity: targetOpacity,
              duration: elementDuration,
              ease: elementEase,
              overwrite: true,
            });
          } else {
            // Якщо opacity не анімується в цьому кроці,
            // переконуємося, що елемент видимий (якщо він належить до поточної групи)
            if (getElementGroup(globalIndex) === currentGroup) {
              // Зберігаємо поточну opacity або встановлюємо 1, якщо вона не встановлена
              const currentOpacity = childGroup.userData.opacity || 1;
              gsap.set(childGroup.userData, { opacity: currentOpacity });
            }
          }
        });
      }

      // Переконуємося, що всі елементи поточної групи, які не анімуються, зберігають свою видимість
      elementRefs.current.forEach((element, index) => {
        if (element instanceof Group) {
          const elementGroup = getElementGroup(index);
          if (elementGroup === currentGroup) {
            // Перевіряємо, чи анімується цей елемент в поточному кроці
            const localElementIndex = getLocalElementIndex(currentGroup, index);
            const isAnimated = step.elements?.some(
              (el) => el.elementIndex === localElementIndex,
            );

            if (debug) {
              console.log(
                `🔍 Перевірка збереження стану для елемента ${index}:`,
                {
                  elementGroup,
                  localElementIndex,
                  isAnimated,
                  currentOpacity: element.userData.opacity,
                },
              );
            }

            if (!isAnimated) {
              // Якщо елемент не анімується, зберігаємо його поточну opacity
              const currentOpacity = element.userData.opacity || 1;
              if (currentOpacity > 0) {
                gsap.set(element.userData, { opacity: currentOpacity });

                if (debug) {
                  console.log(
                    `✅ Збережено opacity ${currentOpacity} для елемента ${index}`,
                  );
                }
              }
            }
          }
        }
      });

      // Виклик callback'ів
      if (onProgress) {
        onProgress(progress, stepIndex);
      }

      if (debug && progress >= 1.0) {
        console.log(
          `🎯 Крок ${stepIndex} завершено з прогресом ${progress.toFixed(3)}`,
        );
      }

      // Відстежуємо завершені кроки для уникнення дублікатів
      if (progress >= 1.0) {
        setCompletedSteps((prev) => {
          const stepKey = stepIndex * 100 + (direction === "down" ? 1 : 0);
          if (!prev.has(stepKey)) {
            const newSet = new Set(prev);
            newSet.add(stepKey);

            // Викликаємо onStepEnd тільки при першому завершенні
            if (onStepEnd) {
              onStepEnd(stepIndex, direction);
              if (debug) {
                console.log(
                  `🏁 onStepEnd викликано для кроку ${stepIndex} (${direction})`,
                );
              }
            }

            return newSet;
          }
          return prev;
        });
      }
    },
    [
      steps,
      debug,
      getPropertyValue,
      interpolateVector3,
      interpolateNumber,
      onProgress,
      onStepEnd,
      snapThreshold,
      getGroupForStep,
      onGroupChange,
      findGlobalElementIndex,
    ],
  );

  // Функція для обчислення прогресу кроку на основі scrollRange
  const calculateStepProgress = useCallback(
    (groupProgress: number, stepIndex: number, groupSteps: typeof steps) => {
      // Обчислюємо кумулятивні діапазони для кроків групи
      let cumulativeRange = 0;
      const stepRanges: { start: number; end: number; scrollRange: number }[] =
        [];

      groupSteps.forEach((step) => {
        const start = cumulativeRange;
        const end = cumulativeRange + step.scrollRange;
        stepRanges.push({ start, end, scrollRange: step.scrollRange });
        cumulativeRange += step.scrollRange;
      });

      // Нормалізуємо до 0-1 (на випадок, якщо сума scrollRange не дорівнює 1)
      const totalRange = cumulativeRange;
      stepRanges.forEach((range) => {
        range.start /= totalRange;
        range.end /= totalRange;
      });

      // Знаходимо активний крок та його прогрес
      let activeStepIndex = 0;
      let stepProgress = 0;

      // Обробка граничних випадків
      if (groupProgress <= 0) {
        return { activeStepIndex: 0, stepProgress: 0 };
      }

      if (groupProgress >= 1) {
        return { activeStepIndex: stepRanges.length - 1, stepProgress: 1 };
      }

      for (let i = 0; i < stepRanges.length; i++) {
        const range = stepRanges[i];
        if (groupProgress >= range.start && groupProgress <= range.end) {
          activeStepIndex = i;
          // Обчислюємо прогрес в межах цього кроку
          const rangeSize = range.end - range.start;
          stepProgress =
            rangeSize > 0 ? (groupProgress - range.start) / rangeSize : 0;
          break;
        } else if (groupProgress > range.end) {
          // Якщо ми пройшли цей крок, він має прогрес 1.0
          activeStepIndex = i;
          stepProgress = 1.0;
        }
      }

      // Забезпечуємо, що stepProgress знаходиться в межах 0-1
      stepProgress = Math.max(0, Math.min(1, stepProgress));

      return { activeStepIndex, stepProgress };
    },
    [],
  );

  // Обробка скролу з використанням scrollRange
  const handleScroll = useCallback(
    (deltaY: number, direction: "up" | "down" | null) => {
      if (Math.abs(deltaY) < minDelta || !direction) return;

      const normalizedDelta = deltaY * sensitivity;

      // Викликаємо onAnimationStart тільки при першому скролі
      if (!isAnimationActive) {
        setIsAnimationActive(true);
        if (onAnimationStart) {
          onAnimationStart();
        }
      }

      const prev = animationStateRef.current;
      const newState = { ...prev };

      // Визначаємо напрямок
      newState.direction = direction;

      // Групуємо кроки за групами для обчислення scrollRange
      const groupStepsMap = new Map<string | number, typeof steps>();
      steps.forEach((step, index) => {
        const group = getGroupForStep ? getGroupForStep(index) : "default";
        if (!groupStepsMap.has(group)) {
          groupStepsMap.set(group, []);
        }
        groupStepsMap.get(group)!.push(step);
      });

      // Обчислюємо загальний прогрес на основі кількості груп
      const totalGroups = Array.from(groupStepsMap.keys()).length;
      const progressDelta = normalizedDelta / totalGroups;
      newState.totalProgress = Math.max(
        0,
        Math.min(1, prev.totalProgress + progressDelta),
      );

      // Викликаємо onAnimationEnd при досягненні повного завершення анімації
      if (prev.totalProgress < 1 && newState.totalProgress >= 1) {
        setTimeout(() => {
          if (onAnimationEnd) {
            onAnimationEnd();
          }
        }, 100);
      } else if (prev.totalProgress > 0 && newState.totalProgress <= 0) {
        setIsAnimationActive(false);
      }

      // Визначаємо поточну групу та її прогрес на основі кроків
      let currentGroup: string | number | null = null;
      let groupProgress = 0;
      let globalStepIndex = 0;

      // Обчислюємо глобальний індекс кроку
      if (newState.totalProgress >= 1.0) {
        globalStepIndex = steps.length - 1;
      } else {
        globalStepIndex = Math.floor(newState.totalProgress * steps.length);
        globalStepIndex = Math.max(
          0,
          Math.min(globalStepIndex, steps.length - 1),
        );
      }

      // Отримуємо групу для поточного кроку
      if (getGroupForStep) {
        currentGroup = getGroupForStep(globalStepIndex);
      }

      // Знаходимо кроки поточної групи
      const currentGroupSteps =
        groupStepsMap.get(currentGroup || "default") || [];

      // Обчислюємо прогрес групи на основі позиції кроку в групі
      if (currentGroupSteps.length > 0) {
        // Знаходимо індекс кроку в межах групи
        let stepIndexInGroup = 0;
        let cumulativeSteps = 0;

        for (const [group, groupSteps] of groupStepsMap.entries()) {
          if (group === currentGroup) {
            stepIndexInGroup = globalStepIndex - cumulativeSteps;
            break;
          }
          cumulativeSteps += groupSteps.length;
        }

        // Обчислюємо прогрес в межах групи
        if (newState.totalProgress >= 1.0) {
          groupProgress = 1.0;
        } else {
          const stepFloat = newState.totalProgress * steps.length;
          const stepProgress = stepFloat - Math.floor(stepFloat);
          groupProgress =
            (stepIndexInGroup + stepProgress) / currentGroupSteps.length;
          groupProgress = Math.max(0, Math.min(1, groupProgress));
        }
      }

      // Обчислюємо активний крок та його прогрес в межах групи
      const { activeStepIndex: groupStepIndex, stepProgress } =
        calculateStepProgress(Math.min(groupProgress, 1), 0, currentGroupSteps);

      // Оновлюємо глобальний індекс кроку на основі активного кроку в групі
      let finalGlobalStepIndex = 0;
      let cumulativeSteps = 0;

      for (const [group, groupSteps] of groupStepsMap.entries()) {
        if (group === currentGroup) {
          finalGlobalStepIndex = cumulativeSteps + groupStepIndex;
          break;
        }
        cumulativeSteps += groupSteps.length;
      }

      // Обмежуємо індекс кроку
      finalGlobalStepIndex = Math.min(finalGlobalStepIndex, steps.length - 1);

      // Забезпечуємо, що stepProgress доходить до 1.0 в кінці
      let finalStepProgress = stepProgress;
      if (newState.totalProgress >= 1.0) {
        finalStepProgress = 1.0;
      } else if (newState.totalProgress <= 0) {
        finalStepProgress = 0;
      }

      if (debug) {
        console.log(`📊 Поточний стан:`, {
          totalProgress: newState.totalProgress.toFixed(3),
          currentGroup,
          groupProgress: groupProgress.toFixed(3),
          groupStepIndex,
          finalGlobalStepIndex,
          stepProgress: finalStepProgress.toFixed(3),
        });
      }

      // Перевіряємо чи змінився крок
      if (finalGlobalStepIndex !== prev.currentStep) {
        if (onStepStart) {
          onStepStart(finalGlobalStepIndex, direction);
        }

        newState.currentStep = finalGlobalStepIndex;
      }

      newState.progress = finalStepProgress;

      // Виконуємо анімацію
      animateStep(finalGlobalStepIndex, finalStepProgress, direction);

      // Оновлюємо ref
      animationStateRef.current = newState;
    },
    [
      minDelta,
      sensitivity,
      debug,
      onStepStart,
      isAnimationActive,
      onAnimationStart,
      onAnimationEnd,
      animateStep,
      calculateStepProgress,
      getGroupForStep,
      steps,
    ],
  );

  // Підключаємо хук скролу
  useDoubleScrollDirection({
    onScroll: handleScroll,
  });

  // Ініціалізація
  useEffect(() => {
    // Не очищаємо елементи при зміні групи, тому що всі елементи рендеряться одразу

    // Встановлюємо початкові значення для всіх елементів
    elementRefs.current.forEach((element, index) => {
      if (element instanceof Group) {
        // Зупиняємо всі поточні анімації
        gsap.killTweensOf([
          element,
          element.position,
          element.rotation,
          element.scale,
        ]);

        // Отримуємо початкові значення для першої групи
        const firstGroup = getGroupForStep ? getGroupForStep(0) : null;
        const initialValues = firstGroup
          ? getInitialValuesFromSteps(firstGroup, "down", index)
          : {
              position: [0, 0, 0] as Vector3,
              rotation: [0, 0, 0] as Vector3,
              scale: [1, 1, 1] as Vector3,
              opacity: 0,
            };

        // Встановлюємо початкові значення для всіх елементів через GSAP
        gsap.set(element.position, {
          x: initialValues.position?.[0] || 0,
          y: initialValues.position?.[1] || 0,
          z: initialValues.position?.[2] || 0,
        });
        gsap.set(element.rotation, {
          x: initialValues.rotation?.[0] || 0,
          y: initialValues.rotation?.[1] || 0,
          z: initialValues.rotation?.[2] || 0,
        });
        gsap.set(element.scale, {
          x: initialValues.scale?.[0] || 1,
          y: initialValues.scale?.[1] || 1,
          z: initialValues.scale?.[2] || 1,
        });

        // Встановлюємо opacity через GSAP - всі елементи спочатку прозорі
        gsap.set(element.userData, { opacity: 0 });

        // Зберігаємо початкові стани елементів
        saveElementInitialState(index, element);
      }
    });

    // Ініціалізуємо групу для першого кроку
    if (getGroupForStep) {
      const firstGroup = getGroupForStep(0);
      currentGroupRef.current = firstGroup;
      setCurrentRenderGroup(firstGroup);
    }

    // Cleanup function - зупиняємо анімації при демонтажі
    return () => {
      elementRefs.current.forEach((element) => {
        if (element instanceof Group) {
          gsap.killTweensOf([
            element,
            element.position,
            element.rotation,
            element.scale,
          ]);

          // Очищаємо userData
          Object.keys(element.userData).forEach((key) => {
            delete element.userData[key];
          });
        }
      });

      // Очищаємо початкові стани
      elementInitialStates.current.clear();

      console.log(
        `🛑 [${componentId.current}] GSAP анімації зупинено та очищено при демонтажі`,
      );
    };
  }, [debug, steps.length, getGroupForStep, saveElementInitialState]);

  // Рендер дітей
  const renderChildren = useCallback(() => {
    // Оскільки ми рендеримо всі елементи одразу, не очищаємо elementRefs при зміні групи

    if (typeof children === "function") {
      const childrenArray = children(1, currentRenderGroup || undefined);

      // Якщо це масив елементів, обгортаємо кожен в групу з рефом
      if (React.isValidElement(childrenArray)) {
        return childrenArray;
      }

      // Якщо це масив елементів
      if (Array.isArray(childrenArray)) {
        const result = childrenArray.map((child, index) => (
          <group
            key={index}
            ref={(el) => {
              if (el && !elementRefs.current[index]) {
                elementRefs.current[index] = el;

                // Встановлюємо початкову прозорість 0 одразу при рендерингу
                gsap.set(el.userData, { opacity: 0 });
              }
            }}
          >
            {child}
          </group>
        ));

        return result;
      }

      return childrenArray;
    }

    // Якщо це React.ReactNode
    if (React.isValidElement(children)) {
      return (
        <group
          ref={(el) => {
            if (el && !elementRefs.current[0]) {
              elementRefs.current[0] = el;

              // Встановлюємо початкову прозорість 0 одразу при рендерингу
              gsap.set(el.userData, { opacity: 0 });
            }
          }}
        >
          {children}
        </group>
      );
    }

    // Якщо це масив елементів
    if (Array.isArray(children)) {
      return children.map((child, index) => (
        <group
          key={index}
          ref={(el) => {
            if (el && !elementRefs.current[index]) {
              elementRefs.current[index] = el;

              // Встановлюємо початкову прозорість 0 одразу при рендерингу
              gsap.set(el.userData, { opacity: 0 });
            }
          }}
        >
          {child}
        </group>
      ));
    }

    return (
      <group
        ref={(el) => {
          if (el && !elementRefs.current[0]) {
            elementRefs.current[0] = el;

            // Встановлюємо початкову прозорість 0 одразу при рендерингу
            gsap.set(el.userData, { opacity: 0 });
          }
        }}
      >
        {children}
      </group>
    );
  }, [children, currentRenderGroup]);

  return <group>{renderChildren()}</group>;
};

export default AnimateFromScroll;
