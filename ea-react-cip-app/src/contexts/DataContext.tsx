// DataContext.tsx
import React, { createContext, useState } from 'react';
import { TableRow, CostTableRow, CustomNodeProps } from '../types/public-types'
import { Edge } from 'reactflow'
import { ViewMode } from 'gantt-task-react'
import { initTasks } from '../components/gantt_components/GanttHelper'
import { Task } from '../types/public-types';

type DataContextType = {
    // Populate Table Props
    table1Data: TableRow[];
    setTable1Data: (data: TableRow[]) => void;
    table2Data: CostTableRow[];
    setTable2Data: (data: CostTableRow[]) => void;
    isTable1Visible: boolean;
    setIsTable1Visible: React.Dispatch<React.SetStateAction<boolean>>;

    // States from CostTable
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    sliderValue: number;
    setSliderValue: React.Dispatch<React.SetStateAction<number>>;
    editingRowIndex: number | null;
    setEditingRowIndex: React.Dispatch<React.SetStateAction<number | null>>;
    selectedPackages: Set<string>;
    setSelectedPackages: React.Dispatch<React.SetStateAction<Set<string>>>;
    showChecklistModal: boolean;
    setShowChecklistModal: React.Dispatch<React.SetStateAction<boolean>>;
    collapsedCostGroups: Set<string>;
    setCollapsedCostGroups: React.Dispatch<React.SetStateAction<Set<string>>>;

    // States from AssetTable
    dropdownValues: { [key: string]: string };
    setDropdownValues: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
    collapsedAssetRows: Set<number>;
    setCollapsedAssetRows: React.Dispatch<React.SetStateAction<Set<number>>>;
    outputValues: { [key: string]: number };
    setOutputValues: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;

    // States for CostDashboard
    showCostPackageModal: boolean;
    setShowCostPackageModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedWeirs: string[];
    setSelectedWeirs: React.Dispatch<React.SetStateAction<string[]>>;
    chartData: number | null;
    setChartData: React.Dispatch<React.SetStateAction<number | null>>;

    // Reacflow States
    nodes: CustomNodeProps[];
    setNodes: React.Dispatch<React.SetStateAction<CustomNodeProps[]>>;
    edges: Edge[];
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;

    // Gantt chart states
    view: ViewMode;
    setView: React.Dispatch<React.SetStateAction<ViewMode>>;
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    isChecked: boolean;
    setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
    isGanttOpen: boolean;
    setIsGanttOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isSubTaskOpen: boolean;
    setIsSubTaskOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedTask: Task | null;
    setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
    // Gantt modal states
    selectedStartDate: Date | null;
    setSelectedStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
    selectedEndDate: Date | null;
    setSelectedEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
  };
  

const DataContext = createContext<DataContextType | undefined>(undefined);
export default DataContext;

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // Populate Table States
  const [table1Data, setTable1Data] = useState<TableRow[]>([]);
  const [table2Data, setTable2Data] = useState<CostTableRow[]>([]);
  const [isTable1Visible, setIsTable1Visible] = useState(true);

  // Asset Table States
  const [dropdownValues, setDropdownValues] = useState<{ [key: string]: string }>({});
  const [outputValues, setOutputValues] = useState<{ [key: string]: number }>({});
  const [collapsedAssetRows, setCollapsedAssetRows] = useState<Set<number>>(
    new Set(table1Data.map((_, rowIndex) => rowIndex).slice(1))  // Exclude header row
  );

  // Cost Table States
  const [showModal, setShowModal] = useState(false);
  const [sliderValue, setSliderValue] = useState<number>(50);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [selectedPackages, setSelectedPackages] = useState<Set<string>>(new Set());
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [collapsedCostGroups, setCollapsedCostGroups] = useState<Set<string>>(
    new Set(table2Data.map(row => row[0]))
  );

  // CostDashboard States
  const [showCostPackageModal, setShowCostPackageModal] = useState(false);
  const [selectedWeirs, setSelectedWeirs] = useState<string[]>([]);
  const [chartData, setChartData] = useState<number | null>(null);

  // Reactflow States
  const [nodes, setNodes] = useState<CustomNodeProps[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // Gantt chart States
  const [view, setView] = useState<ViewMode>(ViewMode.Month);
  const [tasks, setTasks] = useState<Task[]>(initTasks());
  const [isChecked, setIsChecked] = useState(true);
  const [isGanttOpen, setIsGanttOpen] = useState(false);
  const [isSubTaskOpen, setIsSubTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  // Gantt modal states
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

  const contextValue: DataContextType = {
    // Table States
    table1Data,
    setTable1Data,
    table2Data,
    setTable2Data,
    isTable1Visible,
    setIsTable1Visible,

    // New state values for AssetTable
    collapsedAssetRows,
    setCollapsedAssetRows,
    dropdownValues,
    setDropdownValues,
    outputValues, 
    setOutputValues,

    // New state values for CostTable
    showModal,
    setShowModal,
    sliderValue,
    setSliderValue,
    editingRowIndex,
    setEditingRowIndex,
    selectedPackages,
    setSelectedPackages,
    showChecklistModal,
    setShowChecklistModal,
    collapsedCostGroups,
    setCollapsedCostGroups,

    // CostDashboard States
    showCostPackageModal,
    setShowCostPackageModal,
    selectedWeirs,
    setSelectedWeirs,
    chartData,
    setChartData,

    // Reacflow states
    nodes,
    setNodes,
    edges,
    setEdges,
    isEditing,
    setIsEditing,

    // Gantt chart states
    view,
    setView,
    tasks,
    setTasks,
    isChecked,
    setIsChecked,
    isGanttOpen,
    setIsGanttOpen,
    isSubTaskOpen,
    setIsSubTaskOpen,
    selectedTask,
    setSelectedTask,
    // Gantt modal names
    selectedStartDate,
    setSelectedStartDate,
    selectedEndDate,
    setSelectedEndDate,

  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};