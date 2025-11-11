export type GetComponentProps<T> = T extends
  | React.ComponentType<infer P>
  | React.Component<infer P>
  ? P
  : never;

export type Optionally<T> = {
  [K in keyof T]?: T[K];
};

export type IEmptyFunction = () => void;
