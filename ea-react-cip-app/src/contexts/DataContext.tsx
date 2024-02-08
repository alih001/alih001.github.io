// DataContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { TableRow } from '../types/public-types'

type DataContextType = {
    // Populate Table Props
    table1Data: TableRow[];
    setTable1Data: (data: TableRow[]) => void;
    table2Data: TableRow[];
    setTable2Data: (data: TableRow[]) => void;
    isTable1Visible: boolean;
    setIsTable1Visible: (visible: boolean) => void;

    // States from CostTable
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    sliderValue: number;
    setSliderValue: React.Dispatch<React.SetStateAction<number | null>>;
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
    outputValues: { [key: string]: string };
    setOutputValues: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;

    // New states for NetworkLinks
    mapState: { scale: number; translation: { x: number; y: number } };
    setMapState: React.Dispatch<React.SetStateAction<typeof mapState>>;
    mode: string;
    setMode: React.Dispatch<React.SetStateAction<string>>;
    arrows: Array<{ startId: string; endId: string }>;
    setArrows: React.Dispatch<React.SetStateAction<typeof arrows>>;
    tempStart: string | null;
    setTempStart: React.Dispatch<React.SetStateAction<string | null>>;
    nodes: Node[];
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  };
  

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // Populate Table States
  const [table1Data, setTable1Data] = useState<TableRow[]>([]);
  const [table2Data, setTable2Data] = useState<TableRow[]>([]);
  const [isTable1Visible, setIsTable1Visible] = useState(true);

  // Asset Table States
  const [dropdownValues, setDropdownValues] = useState<{ [key: string]: string }>({});
  const [outputValues, setOutputValues] = useState<{ [key: string]: string }>({});
  const [collapsedAssetRows, setCollapsedAssetRows] = useState<Set<number>>(
    new Set(table1Data.map((_, rowIndex) => rowIndex).slice(1))  // Exclude header row
  );

  // Cost Table States
  const [showModal, setShowModal] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
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
  const [nodes, setNodes] = useState<Node[]>([]);

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
    nodes,
    setNodes
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
