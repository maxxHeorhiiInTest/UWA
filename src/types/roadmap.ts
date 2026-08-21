export type RoadmapNode =
  | string
  | {
      label: string;
      note?: string;
      children?: RoadmapNode[];
    };
