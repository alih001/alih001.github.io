// Dashboard.tsx
import React from 'react';


type Node = {
  id: string;
  name: string;
  x: number;
  y: number;
};

type DashboardProps = {
  nodes: Node[];
  onAddNode: (x: number, y: number) => void;
  onClose: () => void;
};

const Dashboard: React.FC<DashboardProps> = ({ nodes, onAddNode, onClose }) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onAddNode(e.clientX, e.clientY);
  };

  return (
    <div className="dashboard" onClick={handleClick}>
    <button className="close-dashboard" onClick={onClose}>Close Dashboard</button>
      {/* {nodes.map(node => (
        <div key={node.id} className="node" style={{ left: node.x, top: node.y }}>
          {node.name}
        </div>
      ))} */}

    </div>
  );
};

export default Dashboard;
