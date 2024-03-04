// NetworkLinks.tsx
import React, { useCallback, useRef, useState, useMemo } from 'react';
import { useData } from '../../contexts/useDataContext';
import ReactFlow, { applyNodeChanges, applyEdgeChanges, addEdge, MarkerType, ReactFlowProvider } from 'reactflow';
import '../../styles/networkLinks.css';
import CustomNode from './CustomNode';
import FloatingEdge from './FloatingEdge';
import CustomConnectionLine from './CustomConnectionLine';
import { Circle } from '@uiw/react-color';
import { CustomNodeProps } from '../../types/public-types';
import 'reactflow/dist/style.css';
import '../../styles/nodeStyles.css';

import NodeSidebar from './AddNodeSidebar';

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
  const [editingNode, setEditingNode] = useState({ isEditing: false, nodeId: '' });
  const [nodeNameInput, setNodeNameInput] = useState('');
  const editNodeRef = useRef(null)

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const [selectedColor, setSelectedColor] = useState('#FE9200');

  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);


  const handleNodeEdit = useCallback((nodeId: string) => {
    const nodeToEdit: CustomNodeProps = nodes.find((node) => node.id === nodeId);
    if (nodeToEdit) {
      setNodeNameInput(nodeToEdit.data.nodeName);
      setSelectedColor(nodeToEdit.data.nodeColour || '');
    }
    setEditingNode({ isEditing: true, nodeId });
  }, [nodes, setNodeNameInput, setSelectedColor, setEditingNode]);

  const nodeTypes = useMemo(() => ({
    custom: (nodeProps) => <CustomNode {...nodeProps} onEdit={handleNodeEdit} />,
  }), [handleNodeEdit]); // Recalculate only if handleNodeEdit changes

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

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
  
      console.log("add node node")

      if (typeof type === 'undefined' || !type) {
        return;
      }
  
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: CustomNodeProps = {
        id: Date.now().toString(),
        type,
        position,
        data: { label: `${type} node`, nodeName: 'Custom Node', nodeColour: 'brown' },
      };
  
      console.log(newNode)

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );
  
  const renderEditNodes = (nodeId: string) => {
    const handleInputChange = (event) => {
      setNodeNameInput(event.target.value);
    };
  
    const handleColorChange = (colorHex: string) => {
      setSelectedColor(colorHex);
    };

    const handleSubmit = () => {
      const updatedNodes = nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, nodeName: nodeNameInput, nodeColour: selectedColor } } : node
      );

      setNodes(updatedNodes);
      setEditingNode({ isEditing: false, nodeId: '' }); // Reset editing state
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
            handleColorChange(color.hex);
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
      <ReactFlowProvider>
        <div className='content' ref={reactFlowWrapper}>
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
            onDrop={onDrop}
            onDragOver={onDragOver}
            onInit={setReactFlowInstance}
          />
        </div>
      </ReactFlowProvider>
      <div className='networkDescription' ref={editNodeRef}>
        <NodeSidebar/>
        {renderDynamicSection()}
      </div>
    </div>

    </>
  );
};

export default NetworkLinks;