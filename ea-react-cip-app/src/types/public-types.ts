import { ViewMode } from "gantt-task-react";

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

// FileUpload Types
export type FileUploadProps = {
    onFileSelect: (file: File) => void;
  };

// DashboardCard Interface
export interface DashboardCardProps {
    title: string;
    children?: React.ReactNode;
    width: number;
    height: number;
    left: number;
    top: number;
}

export interface MainContainerProps{
    width: number;
    height: number
    left: number;
    top: number;
}

// Table Types
export type TableCell = (string | number);
export type TableRow = TableCell[];
export type TableData = TableRow[];

// CostTable Types
export type CostTableProps = {
    data: TableData;
    onDataChange: (newData: TableData) => void;
    tableId: string;
  };

