"use client";

import {
  addEdge,
  Background,
  BackgroundVariant,
  BaseEdge,
  Connection,
  Controls,
  Edge,
  EdgeProps,
  Handle,
  MarkerType,
  MiniMap,
  Node,
  NodeProps,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { useCallback, useMemo } from "react";

import "@xyflow/react/dist/style.css";

// カスタムエッジの実装
const CustomCurvedEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourceHandleId,
  targetHandleId,
  style = {},
  markerEnd,
  label,
}: EdgeProps) => {
  // Handle IDからインデックスを抽出して角度(ラジアン)を計算する関数
  const getHandleAngle = (handleId: string | null | undefined) => {
    if (!handleId) return 0;
    const match = handleId.match(/-(\d+)$/);
    if (!match) return 0;
    const index = parseInt(match[1], 10);
    const numHandles = 12;
    // 角度をラジアンに変換
    return ((index * 360) / numHandles) * (Math.PI / 180);
  };

  const sourceAngle = getHandleAngle(sourceHandleId);
  const targetAngle = getHandleAngle(targetHandleId);

  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // 制御点の距離を計算
  // 自己ループ(距離0)の場合は固定サイズ、それ以外は距離に応じたサイズにする
  const controlDist = dist === 0 ? 100 : Math.max(dist * 0.4, 50);

  // 制御点1: 始点からHandleの角度方向に伸ばす
  const cp1X = sourceX + Math.cos(sourceAngle) * controlDist;
  const cp1Y = sourceY + Math.sin(sourceAngle) * controlDist;

  // 制御点2: 終点からHandleの角度方向に伸ばす
  // (ベジェ曲線の定義上、終点に向かうベクトルは cp2 -> target なので、
  //  cp2を外側に置くことで、外側からターゲットに入ってくる軌道になる)
  const cp2X = targetX + Math.cos(targetAngle) * controlDist;
  const cp2Y = targetY + Math.sin(targetAngle) * controlDist;

  const edgePath = `M ${sourceX},${sourceY} C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${targetX},${targetY}`;

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
    </>
  );
};

// 固定Handle付きカメラノード
const DynamicHandleCameraNode = ({ data, isConnectable }: NodeProps) => {
  const handles = useMemo(() => {
    const numHandles = 12;
    const handleElements = [];

    for (let i = 0; i < numHandles; i++) {
      // 360度を12分割 (0, 30, 60, ..., 330)
      const angle = (i * 360) / numHandles;
      const radian = (angle * Math.PI) / 180;

      const x = 50 + Math.cos(radian) * 50;
      const y = 50 + Math.sin(radian) * 50;

      const left = `${x.toFixed(4)}%`;
      const top = `${y.toFixed(4)}%`;

      // Source Handle
      handleElements.push({
        id: `source-${i}`,
        type: "source" as const,
        position: Position.Top, // Positionは見た目の向きだが、絶対配置するのであまり影響しない
        style: {
          left: left,
          top: top,
          position: "absolute" as const,
          transform: "translate(-50%, -50%)",
          background: "transparent",
          width: "0px",
          height: "0px",
          border: "none",
          minWidth: "0px",
          minHeight: "0px",
        },
      });

      // Target Handle
      handleElements.push({
        id: `target-${i}`,
        type: "target" as const,
        position: Position.Top,
        style: {
          left: left,
          top: top,
          position: "absolute" as const,
          transform: "translate(-50%, -50%)",
          background: "transparent",
          width: "0px",
          height: "0px",
          border: "none",
          minWidth: "0px",
          minHeight: "0px",
        },
      });
    }

    return handleElements;
  }, []);

  return (
    <div
      style={{
        background: "#f8f9fa",
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "50%",
        width: 100,
        height: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        position: "relative",
      }}>
      {handles.map((handle) => (
        <Handle
          key={handle.id}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          isConnectable={isConnectable}
          style={handle.style}
        />
      ))}
      {/* ノードのラベル */}
      <div>{data.label as string}</div>
    </div>
  );
};

const nodeTypes = {
  camera: DynamicHandleCameraNode,
};

const edgeTypes = {
  curved: CustomCurvedEdge,
};

const initialNodes: Node[] = [
  {
    id: "camera-1",
    type: "camera",
    position: { x: 100, y: 300 },
    data: { label: "Camera 1" },
  },
  {
    id: "camera-2",
    type: "camera",
    position: { x: 500, y: 300 },
    data: { label: "Camera 2" },
  },
  {
    id: "camera-3",
    type: "camera",
    position: { x: 300, y: 50 },
    data: { label: "Camera 3" },
  },
];

const initialEdges: Edge[] = [
  // 1 -> 2 (Camera 1の右側から出て、Camera 2の左側に入る)
  {
    id: "flow-1-2",
    source: "camera-1",
    target: "camera-2",
    sourceHandle: "source-0",
    targetHandle: "target-6",
    label: "120 people",
    type: "curved",
    data: { offset: 40 },
    animated: true,
    style: { strokeWidth: 8, stroke: "#3b82f6" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" },
  },
  // 2 -> 1 (Camera 2の左側から出て、Camera 1の右側に入る)
  // 1->2と少しずらす (Camera 2: 6->5, Camera 1: 0->1)
  {
    id: "flow-2-1",
    source: "camera-2",
    target: "camera-1",
    sourceHandle: "source-5",
    targetHandle: "target-1",
    label: "20 people",
    type: "curved",
    data: { offset: 40 },
    animated: true,
    style: { strokeWidth: 2, stroke: "#94a3b8" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
  },

  // 2 -> 3 (Camera 2の左上から出て、Camera 3の右下に入る)
  // Camera 2 (x:500, y:300) -> Camera 3 (x:300, y:50) : 方向はおよそ左上(210度くらい=Handle 7-8付近)
  // Camera 3 -> Camera 2 : 方向はおよそ右下(30度くらい=Handle 1-2付近)
  {
    id: "flow-2-3",
    source: "camera-2",
    target: "camera-3",
    sourceHandle: "source-7",
    targetHandle: "target-1",
    label: "80 people",
    type: "curved",
    data: { offset: 40 },
    animated: true,
    style: { strokeWidth: 6, stroke: "#3b82f6" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" },
  },
  // 3 -> 2
  // ずらす: Camera 3 (1->2), Camera 2 (7->8)
  {
    id: "flow-3-2",
    source: "camera-3",
    target: "camera-2",
    sourceHandle: "source-2",
    targetHandle: "target-8",
    label: "15 people",
    type: "curved",
    data: { offset: 40 },
    animated: true,
    style: { strokeWidth: 2, stroke: "#94a3b8" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
  },

  // 3 -> 1 (Camera 3の左下から出て、Camera 1の右上に入る)
  // Camera 3 (x:300, y:50) -> Camera 1 (x:100, y:300) : 方向はおよそ左下(150度くらい=Handle 4-5付近)
  // Camera 1 -> Camera 3 : 方向はおよそ右上(330度くらい=Handle 10-11付近)
  {
    id: "flow-3-1",
    source: "camera-3",
    target: "camera-1",
    sourceHandle: "source-4",
    targetHandle: "target-10",
    label: "40 people",
    type: "curved",
    data: { offset: 40 },
    animated: true,
    style: { strokeWidth: 4, stroke: "#3b82f6" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" },
  },
  // 1 -> 3
  // ずらす: Camera 1 (10->11), Camera 3 (4->5)
  {
    id: "flow-1-3",
    source: "camera-1",
    target: "camera-3",
    sourceHandle: "source-11",
    targetHandle: "target-5",
    label: "10 people",
    type: "curved",
    data: { offset: 40 },
    animated: true,
    style: { strokeWidth: 1, stroke: "#94a3b8" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
  },
  // Self loops (各カメラの空いている場所を使う)
  // Camera 1: 左上が空いている (Handle 9付近)
  {
    id: "flow-1-1",
    source: "camera-1",
    target: "camera-1",
    sourceHandle: "source-9",
    targetHandle: "target-8", // 隣接させる
    label: "5 people",
    type: "curved",
    animated: true,
    style: { strokeWidth: 1, stroke: "#94a3b8" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
  },
  // Camera 2: 右上が空いている (Handle 10-11付近)
  {
    id: "flow-2-2",
    source: "camera-2",
    target: "camera-2",
    sourceHandle: "source-11",
    targetHandle: "target-10",
    label: "8 people",
    type: "curved",
    animated: true,
    style: { strokeWidth: 1, stroke: "#94a3b8" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
  },
  // Camera 3: 上が空いている (Handle 9-10付近)
  {
    id: "flow-3-3",
    source: "camera-3",
    target: "camera-3",
    sourceHandle: "source-10",
    targetHandle: "target-9",
    label: "12 people",
    type: "curved",
    animated: true,
    style: { strokeWidth: 2, stroke: "#94a3b8" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
  },
];

export default function PersonFlowWeight() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div
      className="h-[600px] w-full border border-slate-200 rounded-lg shadow-sm bg-white"
      style={{ height: "600px" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        attributionPosition="bottom-right">
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

