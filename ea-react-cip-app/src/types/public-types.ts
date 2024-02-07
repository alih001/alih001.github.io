// NetworkLinks Types 
export type Node = {
    id: string;
    name: string;
    x: number;
    y: number;
};
  
export type DashboardProps = {
    nodes: Node[];
    onAddNode: (x: number, y: number) => void;
    updateNodes: (updateFn: (prevNodes: Node[]) => Node[]) => void;
};

export type mapStateValue = {
    scale: number;
    translation: {
        x: number;
        y: number;
    };
}

// GanttChart Types
import { ViewMode } from "gantt-task-react";

export type TaskType = "task" | "milestone" | "project";
export interface Task {
  id: string;
  type: TaskType;
  name: string;
  start: Date;
  end: Date;
  /**
   * From 0 to 100
   */
  progress: number;
  styles?: {
    backgroundColor?: string;
    backgroundSelectedColor?: string;
    progressColor?: string;
    progressSelectedColor?: string;
  };
  isDisabled?: boolean;
  project?: string;
  dependencies?: string[];
  hideChildren?: boolean;
  displayOrder?: number;
}


export type ViewSwitcherProps = {
    isChecked: boolean;
    onViewListChange: (isChecked: boolean) => void;
    onViewModeChange: (viewMode: ViewMode) => void;
  };
