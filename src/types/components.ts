// Типи для різних компонентів в системі анімації

export interface BoardComponent {
  id: string;
  type: "board";
  mainText: string;
  subText: string;
  isActive: boolean;
  row?: number;
  col?: number;
}

export interface PersonComponent {
  id: string;
  type: "person";
  name: string;
  role: string;
  image: string;
  description: string;
}

// Об'єднаний тип для всіх можливих компонентів
export type AnimationComponent = BoardComponent | PersonComponent;

// Тип для змішаних груп
export type MixedGroupData = AnimationComponent[];

// Типи для існуючих окремих груп
export type BoardGroupData = BoardComponent[];
export type PersonGroupData = PersonComponent[];
