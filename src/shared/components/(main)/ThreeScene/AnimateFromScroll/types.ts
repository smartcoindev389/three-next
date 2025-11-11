export type Vector3 = [number, number, number];

export interface AnimationProperty<T> {
  from: T;
  to: T;
  animationRange?: number; // Відсоток скролу кроку (0-1), за який буде виконана анімація
}

export interface ElementAnimation {
  elementIndex: number;
  position?: AnimationProperty<Vector3> | Vector3;
  rotation?: AnimationProperty<Vector3> | Vector3;
  scale?: AnimationProperty<Vector3> | Vector3;
  opacity?: AnimationProperty<number> | number;
  duration?: number; // Тривалість анімації для елемента
  delay?: number; // Затримка перед початком для елемента
  ease?: string; // GSAP easing функція для елемента
}

export interface AnimationStep {
  elements?: ElementAnimation[]; // Для персональних анімацій елементів
  scrollRange: number; // Частка скролу (0-1), яку займає цей крок всередині групи
  delay?: number; // Затримка перед початком кроку в секундах
}

export interface InitialValues {
  position?: Vector3;
  rotation?: Vector3;
  scale?: Vector3;
  opacity?: number;
}

export interface ScrollSettings {
  sensitivity?: number; // Чутливість скролу (за замовчуванням 1)
  minDelta?: number; // Мінімальна дельта для активації
  snapThreshold?: number; // Поріг для автоматичного завершення (за замовчуванням 0.8)
}

export interface AnimationCallbacks {
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  onStepStart?: (stepIndex: number, direction: "up" | "down") => void;
  onStepEnd?: (stepIndex: number, direction: "up" | "down") => void;
  onProgress?: (progress: number, stepIndex: number) => void;
  onGroupChange?: (stepIndex: number, direction: "up" | "down") => void;
}

export interface AnimateFromScrollProps {
  children:
    | React.ReactNode
    | ((opacity: number, currentGroup?: number | string) => React.ReactNode);
  steps: AnimationStep[];
  scrollSettings?: ScrollSettings;
  callbacks?: AnimationCallbacks;
  className?: string;
  getInitialValuesForStep?: (stepIndex: number) => InitialValues;
  getGroupForStep?: (stepIndex: number) => number | string; // Додаємо функцію для визначення групи
  debug?: boolean; // Для детального логування
}

export interface AnimationState {
  currentStep: number;
  progress: number; // Прогрес від 0 до 1 для поточного кроку
  totalProgress: number; // Загальний прогрес від 0 до 1
  direction: "up" | "down";
  isAnimating: boolean;
}
