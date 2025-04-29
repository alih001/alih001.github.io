import React, { useCallback, useRef, useState, useMemo } from "react";
import { useData } from "../../contexts/useDataContext";
import ReactFlow, {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MarkerType,
  ReactFlowProvider,
} from "reactflow";
import "../../styles/networkLinks.css";
import CustomNode from "./CustomNode";
import FloatingEdge from "./FloatingEdge";
import CustomConnectionLine from "./CustomConnectionLine";
import { Circle } from "@uiw/react-color";
import { CustomNodeProps } from "../../types/public-types";
import "reactflow/dist/style.css";
import "../../styles/nodeStyles.css";
import styled from "styled-components";
import NodeSidebar from "./AddNodeSidebar";
import EdgePopover from "../custom_components/Edgeover";

const TextWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 1rem;
`;

const ColourWrapper = styled.div`
  margin-left: 1.3rem;
`;

const StyledInput = styled.input`
  padding: 8px 12px;
  border: 2px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  margin: 1rem 0;
  transition: border-color 0.3s;
  &:focus {
    border-color: #007bff;
  }
`;

const Button = styled.label`
  background: #1a87e2;
  color: #fff;
  cursor: pointer;
  margin-bottom: 1rem;
  text-transform: uppercase;
  border-radius: 50px;
  height: 60px;
  width: 230px;
  border-color: transparent;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.75);
  outline: none;
  transition: 0.15s;
  text-align: center;
  display: inline-block;
  line-height: 60px;
  font-size: 25px;
  &:hover {
    background-color: #052e84;
  }
  &:active {
    background-color: #f1ac15;
  }
`;

const connectionLineStyle = {
  strokeWidth: 3,
  stroke: "black",
};

const defaultEdgeOptions = {
  style: { strokeWidth: 3, stroke: "black" },
  type: "floating",
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "black",
  },
};

const NetworkLinks = () => {
  const { nodes, setNodes, edges, setEdges } = useData();
  const [editingNode, setEditingNode] = useState({
    isEditing: false,
    nodeId: "",
  });
  const [nodeNameInput, setNodeNameInput] = useState("");
  const editNodeRef = useRef(null);

  // State for managing the edge popover
  const [edgeContextMenu, setEdgeContextMenu] = useState<{
    edgeId: string;
    x: number;
    y: number;
  } | null>(null);

  const handleEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edgeId: string) => {
      event.preventDefault();
      setEdgeContextMenu({ edgeId, x: event.clientX, y: event.clientY });
    },
    []
  );

  const updateEdgeStrength = useCallback(
    (edgeId: string, strength: "low" | "medium" | "high") => {
      setEdges((eds) =>
        eds.map((edge) => (edge.id === edgeId ? { ...edge, strength } : edge))
      );
    },
    [setEdges]
  );

  const edgeTypes = useMemo(
    () => ({
      floating: (edgeProps: any) => (
        <FloatingEdge {...edgeProps} onEdgeContextMenu={handleEdgeContextMenu} />
      ),
    }),
    [handleEdgeContextMenu]
  );

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) => addEdge({ ...params, strength: "medium" }, eds)),
    [setEdges]
  );

  const [selectedColor, setSelectedColor] = useState("#FE9200");
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const handleNodeEdit = useCallback(
    (nodeId: string) => {
      const nodeToEdit: CustomNodeProps = nodes.find(
        (node) => node.id === nodeId
      );
      if (nodeToEdit) {
        setNodeNameInput(nodeToEdit.data.nodeName);
        setSelectedColor(nodeToEdit.data.nodeColour || "");
      }
      setEditingNode({ isEditing: true, nodeId });
    },
    [nodes, setNodeNameInput, setSelectedColor, setEditingNode]
  );

  const nodeTypes = useMemo(
    () => ({
      custom: (nodeProps) => (
        <CustomNode {...nodeProps} onEdit={handleNodeEdit} />
      ),
    }),
    [handleNodeEdit]
  );

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
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) {
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
        data: {
          label: `${type} node`,
          nodeName: "Custom Node",
          nodeColour: "red",
        },
      };
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
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                nodeName: nodeNameInput,
                nodeColour: selectedColor,
              },
            }
          : node
      );
      setNodes(updatedNodes);
      setEditingNode({ isEditing: false, nodeId: "" });
      setNodeNameInput("");
    };

    return (
      <TextWrapper>
        <StyledInput
          type="text"
          value={nodeNameInput}
          onChange={handleInputChange}
          autoFocus
        />
        <ColourWrapper>
          <Circle
            colors={[
              "#F44E3B",
              "#FE9200",
              "#FCDC00",
              "#FF0000",
              "#DBDF00",
              "#FF80ED",
              "#FFC0CB",
              "#00FFFF",
              "#0000FF",
              "#FF7373",
              "#D3FFCE",
              "#C0C0C0",
            ]}
            color={selectedColor}
            onChange={(color) => {
              handleColorChange(color.hex);
            }}
          />
        </ColourWrapper>
        <Button onClick={handleSubmit}>Update Name</Button>
      </TextWrapper>
    );
  };

  const renderDescription = () => (
    <TextWrapper>
      Use your custom maps to visualise how different factors in your system will affect each other :)
    </TextWrapper>
  );

  const renderDynamicSection = () => {
    if (editingNode.isEditing) {
      return renderEditNodes(editingNode.nodeId);
    }
    return renderDescription();
  };

  return (
    <>
      <div className="network-dashboard">
        <ReactFlowProvider>
          <div
            className="content"
            ref={reactFlowWrapper}
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
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
              onInit={setReactFlowInstance}
            />
          </div>
        </ReactFlowProvider>
        <div className="networkDescription">
          <NodeSidebar />
          {renderDynamicSection()}
        </div>
      </div>

      {edgeContextMenu && (
        <EdgePopover
          anchorPosition={{
            x: edgeContextMenu.x,
            y: edgeContextMenu.y,
          }}
          currentStrength={
            edges.find((edge) => edge.id === edgeContextMenu.edgeId)?.strength ||
            "medium"
          }
          onChangeStrength={(strength) =>
            updateEdgeStrength(edgeContextMenu.edgeId, strength)
          }
          onClose={() => setEdgeContextMenu(null)}
        />
      )}
    </>
  );
};

export default NetworkLinks;
