// EditableTable.tsx
import React, { useState } from 'react';

type EditableCellProps = {
  value: string;
  onValueChange: (newValue: string) => void;
};

const EditableCell: React.FC<EditableCellProps> = ({ value, onValueChange}) => {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  const handleBlur = () => {
    onValueChange(localValue);
    setEditing(false);
  };

  return (
    <td onClick={() => setEditing(true)}>
      {editing ? (
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
        />
      ) : (
        value
      )}
    </td>
  );
};

type EditableTableProps = {
  data: string[][];
  onDataChange: (newData: string[][]) => void;
  tableId: string;
};

const EditableTable: React.FC<EditableTableProps> = ({ data, onDataChange, tableId}) => {
  const handleCellValueChange = (rowIndex: number, colIndex: number, newValue: string) => {
    const updatedData = data.map((row, rIndex) =>
      rIndex === rowIndex
        ? row.map((cell, cIndex) => (cIndex === colIndex ? newValue : cell))
        : row
    );
    onDataChange(updatedData);
  };

  return (
    <table>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => (
              <EditableCell
                key={`${tableId}-${rowIndex}-${colIndex}`}
                value={cell}
                onValueChange={(newValue) => handleCellValueChange(rowIndex, colIndex, newValue)}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EditableTable;
