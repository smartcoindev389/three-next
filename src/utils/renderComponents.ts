// Утиліти для рендерингу компонентів на основі типу

import React from "react";
import { BoardWithOpacity } from "shared/components/(main)/ThreeScene/BoardWithOpacity";
import { PersonWithOpacity } from "shared/components/(main)/ThreeScene/PersonWithOpacity";
import {
  AnimationComponent,
  BoardComponent,
  PersonComponent,
} from "@/types/components";

// Інтерфейс для компонента з гнучким типом
export interface FlexibleComponent extends Record<string, unknown> {
  id: string;
  type: string;
}

// Функція для рендерингу одного компонента на основі його типу
export const renderComponent = (
  component: FlexibleComponent,
  index: number,
  keyPrefix: string,
): React.ReactNode => {
  const key = `${keyPrefix}-${component.type}-${index}`;

  if (component.type === "board") {
    return React.createElement(BoardWithOpacity, {
      key,
      ...component,
      idx: index,
      isActive: Boolean(component.isActive),
      mainText: String(component.mainText || ""),
    });
  }

  if (component.type === "person") {
    return React.createElement(PersonWithOpacity, {
      key,
      assetPath: String(component.image || ""),
      name: String(component.name || ""),
      role: String(component.role || ""),
      description: String(component.description || ""),
    });
  }

  return null;
};

// Функція для рендерингу масиву компонентів
export const renderComponentArray = (
  components: FlexibleComponent[],
  keyPrefix: string,
): React.ReactNode[] => {
  return components.map((component, index) =>
    renderComponent(component, index, keyPrefix),
  );
};

// Тип гарди для перевірки типів
export const isBoardComponent = (
  component: AnimationComponent,
): component is BoardComponent => {
  return component.type === "board";
};

export const isPersonComponent = (
  component: AnimationComponent,
): component is PersonComponent => {
  return component.type === "person";
};
