// NetworkLinks.tsx
import React, { useCallback } from 'react';
import { useData } from '../contexts/useDataContext';
import ReactFlow, { addEdge, useNodesState, useEdgesState, MarkerType } from 'reactflow';
import { applyNodeChanges, applyEdgeChanges } from 'reactflow';

import CustomNode from './node_scripts/CustomNode';
import FloatingEdge from './node_scripts/FloatingEdge';
import CustomConnectionLine from './node_scripts/CustomConnectionLine';

import 'reactflow/dist/style.css';
import './node_scripts/nodeStyles.css';

const connectionLineStyle = {
  strokeWidth: 3,
  stroke: 'black',
};

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  floating: FloatingEdge,
};

const defaultEdgeOptions = {
  style: { strokeWidth: 3, stroke: 'black' },
  type: 'floating',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: 'black',
  },
};

const NetworkLinks = () => {
  const { nodes, setNodes, edges, setEdges } = useData();

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((prevNodes) => applyNodeChanges(changes, prevNodes));
    },
    [setNodes]
  );
  
  const onEdgesChange = useCallback(
    (changes) => {
      setEdges((prevEdges) => applyEdgeChanges(changes, prevEdges));
    },
    [setEdges]
  );
  

  return (
    <div style={{ height: 500 }}>
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
      connectionLineComponent={CustomConnectionLine}
      connectionLineStyle={connectionLineStyle}
    />
    </div>
  );
};

export default NetworkLinks;