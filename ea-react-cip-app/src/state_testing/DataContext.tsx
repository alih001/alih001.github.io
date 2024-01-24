// DataContext.tsx
import React, { createContext, useState, useContext } from 'react';

type TableRow = (string | number)[];

type DataContextType = {
    table1Data: TableRow[];
    setTable1Data: (data: TableRow[]) => void;
    table2Data: TableRow[];
    setTable2Data: (data: TableRow[]) => void;
    isTable1Visible: boolean;
    setIsTable1Visible: (visible: boolean) => void;
    dropdownValues: { [key: string]: string };
    setDropdownValues: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
    collapsedCostGroups: Set<string>;
    setCollapsedCostGroups: React.Dispatch<React.SetStateAction<Set<string>>>;
    collapsedAssetRows: Set<number>;
    setCollapsedAssetRows: React.Dispatch<React.SetStateAction<Set<number>>>;
    // ... other states and setters
  };
  

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC = ({ children }) => {
  const [table1Data, setTable1Data] = useState<TableRow[]>([]);
  const [table2Data, setTable2Data] = useState<TableRow[]>([]);
  const [isTable1Visible, setIsTable1Visible] = useState(true);
  const [dropdownValues, setDropdownValues] = useState<{ [key: string]: string }>({});

  const [collapsedCostGroups, setCollapsedCostGroups] = useState<Set<string>>(
    new Set(table2Data.map(row => row[0]))
  );

  const [collapsedAssetRows, setCollapsedAssetRows] = useState<Set<number>>(
    new Set(table1Data.map((_, rowIndex) => rowIndex).slice(1))  // Exclude header row
  );

  const contextValue: DataContextType = {
    table1Data,
    setTable1Data,
    table2Data,
    setTable2Data,
    isTable1Visible,
    setIsTable1Visible,
    dropdownValues,
    setDropdownValues,
    collapsedCostGroups,
    setCollapsedCostGroups,
    collapsedAssetRows,
    setCollapsedAssetRows,
    // ... other states and setters
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
