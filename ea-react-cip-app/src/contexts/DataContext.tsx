// DataContext.tsx
import React, { createContext, useState } from 'react';
import { TableRow, CostTableRow, CustomNodeProps } from '../types/public-types'
import { Edge } from 'reactflow'


const initialNodes = [
  {
    id: '1',
    type: 'custom',
    position: { x: 0, y: 0 },
    data: { label: 'Node 1', nodeName: 'Custom Node 1', nodeColour: 'green' }, // Adjusted structure
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 250, y: 320 },
    data: { label: 'Node 2', nodeName: 'Custom Node 2', nodeColour: 'brown'  }, // Adjusted structure
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 40, y: 300 },
    data: { label: 'Node 3', nodeName: 'Custom Node 3', nodeColour: 'brown'  }, // Adjusted structure
  },
  {
    id: '4',
    type: 'custom',
    position: { x: 300, y: 0 },
    data: { label: 'Node 4', nodeName: 'Custom Node 4', nodeColour: 'brown'  }, // Adjusted structure
  },
];


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

    // New states for NetworkLinks
    mapState: { scale: number; translation: { x: number; y: number } };
    setMapState: React.Dispatch<React.SetStateAction<{ scale: number; translation: { x: number; y: number } }>>;
    mode: string;
    setMode: React.Dispatch<React.SetStateAction<string>>;
    arrows: Array<{ startId: string; endId: string }>;
    setArrows: React.Dispatch<React.SetStateAction<Array<{ startId: string; endId: string }>>>;
    tempStart: string | null;
    setTempStart: React.Dispatch<React.SetStateAction<string | null>>;

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

  // Network Link States
  const [mapState, setMapState] = useState({ scale: 1, translation: { x: 0, y: 0 } });
  const [mode, setMode] = useState('edit');
  const [arrows, setArrows] = useState<Array<{ startId: string; endId: string }>>([]);
  const [tempStart, setTempStart] = useState<string | null>(null);

  // CostDashboard States
  const [showCostPackageModal, setShowCostPackageModal] = useState(false);
  const [selectedWeirs, setSelectedWeirs] = useState<string[]>([]);
  const [chartData, setChartData] = useState<number | null>(null);

  // Reactflow States
  const [nodes, setNodes] = useState<CustomNodeProps[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isEditing, setIsEditing] = useState(false);

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

    // Network Link States
    mapState,
    setMapState,
    mode,
    setMode,
    arrows,
    setArrows,
    tempStart,
    setTempStart,

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

  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};