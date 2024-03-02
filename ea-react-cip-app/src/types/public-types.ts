import { ViewMode } from "gantt-task-react";
import { SeriesPoint } from '@visx/shape/lib/types';
import { CityTemperature } from '@visx/mock-data/lib/mocks/cityTemperature';
import { Node } from 'reactflow'
import React from 'react';

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
export type CostTableRow = [
    string, // Weir Name
    string, // Cost Type
    number, // Start Year
    number, // Duration
    string | number, // Package Split
    number, // Package Cost
    ...number[] // Yearly Costs
    ];

export type CostTableData = CostTableRow[];

export type CostTableProps = {
    data: CostTableData;
    onDataChange: (newData: CostTableData) => void;
    tableId: string;
  };

export interface CustomModalProps {
    showModal: boolean;
    closeModal: () => void;
    sliderValue: number;
    handleSliderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSave: () => void;
  }

// AssetTable Types
export type AssetTableProps = {
    data: TableData;
    onDataChange: (newData: TableData) => void;
    tableId: string;
  };

export type DropdownValueMapType = { [key: string]: number };
export type StagesFactorMapType = { [key: number]: number };

// Arrow Props
export type Point = {
    x: number;
    y: number;
  };
  
export type ArrowProps = {
    startPoint: Point;
    endPoint: Point;
  };

export type defaultMargin = {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

// PieChart types
export interface CountMap {
    [key: string]: number;
  }  

export type PieProps = {
    width: number;
    height: number;
    margin?: defaultMargin;
    data: TableData;
    rowReference: number;
  };


// BarChart Props
export type BarGroupProps = {
    width: number;
    height: number;
    margin?: { top: number; right: number; bottom: number; left: number };
    events?: boolean;
};
  
export type CityName = 'New York' | 'San Francisco' | 'Austin';

export type TooltipData = {
    bar: SeriesPoint<CityTemperature>;
    key: CityName;
    index: number;
    height: number;
    width: number;
    x: number;
    y: number;
    color: string;
};
  
export type BarStackProps = {
    width: number;
    height: number;
    margin?: { top: number; right: number; bottom: number; left: number };
    events?: boolean;
};

// CostDashboard Types
export interface WeirRow {
    'Weir Name': string;
    'Package Cost': number;
    [key: string]: string | number;
  }

export interface CustomNodeData {
  nodeName: string;
  nodeColour: string;
}

export interface CustomNodeProps extends Node {
  data: CustomNodeData;
  onEdit?: string;
}

export interface ConnectionPath {
  id: string;
  source: string;
  target: string;
  markerEnd: string;
  style: React.CSSProperties;
}

export type EdgeTuple = {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
}

export type IntersectionType = {
  x: number;
  y: number;
}

export interface CustomConnectionProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  connectionLineStyle: React.CSSProperties;
}
