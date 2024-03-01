// NetworkLinks.tsx
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useData } from '../contexts/useDataContext';
import ReactFlow, { addEdge, useNodesState, useEdgesState, MarkerType } from 'reactflow';
import { applyNodeChanges, applyEdgeChanges } from 'reactflow';
import '../styles/networkLinks.css';
import CustomNode from './node_scripts/CustomNode';
import FloatingEdge from './node_scripts/FloatingEdge';
import CustomConnectionLine from './node_scripts/CustomConnectionLine';
import { Circle } from '@uiw/react-color';

import 'reactflow/dist/style.css';
import './node_scripts/nodeStyles.css';

const connectionLineStyle = {
  strokeWidth: 3,
  stroke: 'black',
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
  const [editingNode, setEditingNode] = useState({ isEditing: false, nodeId: null });
  const [nodeNameInput, setNodeNameInput] = useState('');
  const editNodeRef = useRef(null)
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const [selectedColor, setSelectedColor] = useState('#FE9200');

  const nodeTypes = {
    custom: (nodeProps) => <CustomNode {...nodeProps} onEdit={handleNodeEdit} />,
  };

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

  const handleNodeEdit = useCallback((nodeId) => {
    const nodeToEdit = nodes.find((node) => node.id === nodeId);
    if (nodeToEdit) {
      setNodeNameInput(nodeToEdit.data.nodeName);
      setSelectedColor(nodeToEdit.data.nodeColour || '');
    }
    setEditingNode({ isEditing: true, nodeId });
  }, [nodes]);
  
  
  const renderEditNodes = (nodeId) => {
    const handleInputChange = (event) => {
      setNodeNameInput(event.target.value);
    };
  
    const handleColorChange = (color) => {
      setSelectedColor(color.hex);
    };

    const handleSubmit = () => {
      const updatedNodes = nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, nodeName: nodeNameInput, nodeColour: selectedColor } } : node
      );

      setNodes(updatedNodes);
      setEditingNode({ isEditing: false, nodeId: null }); // Reset editing state
      setNodeNameInput(''); // Clear input field
    };
  
    return (
      <div>
        <input
          type="text"
          value={nodeNameInput}
          onChange={handleInputChange}
          autoFocus
        />
        <Circle
          colors={[ '#F44E3B', '#FE9200', '#FCDC00', '#DBDF00' ]}
          color={selectedColor}
          onChange={(color) => {
            handleColorChange(color);
          }}
        />
        <button onClick={handleSubmit}>Update Name</button>
      </div>
    );
  };
  

  const renderDescription = () => (
    <div>
      This section will provide a brief overview 
      on what's possible in this dashboard
    </div>
  );

  const renderDynamicSection = () => {
    if (editingNode.isEditing) {
      return renderEditNodes(editingNode.nodeId);
    }
    return renderDescription();
  };
  

  return (
    <>
    <div className='network-dashboard'>
      <div className='content'>
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
      <div className='networkDescription' ref={editNodeRef}>
        {renderDynamicSection()}
      </div>
    </div>

    </>
  );
};

export default NetworkLinks;