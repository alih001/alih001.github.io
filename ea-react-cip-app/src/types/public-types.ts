import { ViewMode } from "gantt-task-react";
import { Node } from "reactflow";
import React, { MouseEventHandler } from "react";

// SDB dashboard types

// WRZ Tabs
// public-types.ts

export interface WRZState {
  selectedAssets: Set<string>;
  assetSettings: Record<string, AssetSettings>;
  scenarios: Scenario[];
}

export interface WRZDataMap {
  [wrz: string]: WRZState;
}

export type AssetToWRZMap = Record<string, string[]>;

// CustomAssets
export interface CustomAssetRow {
  year: number;
  assets: {
    [assetName: string]: {
      do: number;
      cost: number;
    };
  };
}

export interface AssetSelectorProps {
  allAssets: string[];
  // selectedAssets: Set<string>;
  // onToggleAsset: (asset: string) => void;
}

export interface AssetColumns {
  doCol?: number;
  costCol?: number;
}

export interface AssetSettings {
  doPercentage: number;
  startYear: number;
}

export interface AssetDetails {
  description?: string;
  wrzCode?: string;
  processLoss?: number;
  outageAllowance?: number;
  licenceMlPerDay?: number;
  leakageMlPerDay?: number;
}

export type AssetDetailsMap = Record<string, AssetDetails>;

// Chart Props
export interface CostChartProps {
  customAssets: CustomAssetRow[];
  selectedAssets: Set<string>;
}

export interface DemandSupplyChartProps {
  demandData: { yearlyDemand: Record<string, number> } | null;
  supplyData: {
    yearlySupply: Record<string, number>;
    droughtAdjustments?: {
      "1/500"?: Record<string, number>;
      "1/200"?: Record<string, number>;
      "1/100"?: Record<string, number>;
    };
  } | null;
  drought: string; // "None", "1/500", "1/200", or "1/100"
}

// src/types/scenarioTypes.ts
export interface FilterCriteria {
  wrz: string;
  planningScenario: string;
  growthForecast: string;
  drought: string;
}

export interface FilterControlsProps {
  criteria: FilterCriteria;
  setCriteria: (criteria: FilterCriteria) => void;
  zones: string[];
  planningScenarios: string[];
  growthForecasts: string[];
}

export interface ScenarioManagerProps {
  activeFilterCriteria: FilterCriteria;
  onLoadScenario: (criteria: FilterCriteria) => void;
}

export interface Scenario {
  id: string; // A unique identifier, e.g., a UUID
  name: string;
  description?: string;
  filterCriteria: FilterCriteria;
  createdAt: number;
}

export interface DemandRow {
  zone: string;
  planningScenario: string;
  growthForecast: string;
  // Dynamic keys for each year, e.g., "2025", "2026", etc.
  [year: string]: string | number;
}

export interface SupplyRow {
  year: number;
  wrz: string;
  scenario: string;
  wafu: number;
  // Optional drought columns for future toggles, if needed
  "1/500"?: number;
  "1/200"?: number;
  "1/100"?: number;
}

export type mapStateValue = {
  scale: number;
  translation: {
    x: number;
    y: number;
  };
};

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

export interface MainContainerProps {
  width: number;
  height: number;
  left: number;
  top: number;
}

// Table Types
export type TableCell = string | number;
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

export type defaultMargin = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

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
export interface TransformedDataItem {
  date: string | number;
  [key: string]: string | number;
}

export type BarGroupProps = {
  width: number;
  height: number;
  inputData: TransformedDataItem[];
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
};

// export type CityName = 'New York' | 'San Francisco' | 'Austin';

// export type TooltipData = {
//     bar: SeriesPoint<CityTemperature>;
//     key: CityName;
//     index: number;
//     height: number;
//     width: number;
//     x: number;
//     y: number;
//     color: string;
// };

export type BarStackProps = {
  width: number;
  height: number;
  inputData: TransformedDataItem[];
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
};

// CostDashboard Types
export interface WeirRow {
  "Weir Name": string;
  "Package Cost": number;
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
};

export type IntersectionType = {
  x: number;
  y: number;
};

export interface CustomConnectionProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  connectionLineStyle: React.CSSProperties;
}

export interface SubTaskModalProps {
  handleSubTaskModal: MouseEventHandler<SVGElement>;
  task: Task;
}

export interface GanttModalProps {
  handleDisplayModal: MouseEventHandler<SVGElement>;
}

export interface ExtendGanttProps {
  tasks: Task[];
  onSelectTask: (value: React.SetStateAction<Task | null>) => void;
}

export interface WeirPackageForm {
  tableParsedData: WeirRow[];
  selectedWeirs: string[];
  handleCheckboxChange: (weirName: string) => void;
}
