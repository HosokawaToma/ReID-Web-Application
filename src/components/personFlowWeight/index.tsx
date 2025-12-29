"use client";

import { ApiV1PersonFlowWeightSearch } from "@/lib/api/v1/personFlowWeightSearch";
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
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useMemo } from "react";
import styles from "./index.module.css";

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
}: // label,
EdgeProps) => {
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

interface PersonFlowWeightProps {
  token: string | null;
}

export default function PersonFlowWeight({ token }: PersonFlowWeightProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const response = await ApiV1PersonFlowWeightSearch(token);
        console.log("PersonFlowWeight response:", response);
        const weights = response.weights || [];
        console.log("PersonFlowWeight weights:", weights);

        if (!Array.isArray(weights)) {
          console.error("Invalid person_flow_weights data:", weights);
          return;
        }

        // 1. ユニークなカメラIDを抽出
        const cameraIds = Array.from(
          new Set(weights.flatMap((w) => [w.source_camera_id, w.target_camera_id]))
        );
        cameraIds.sort(); // 安定した順序のためにソート

        // 2. ノード生成（円形配置）
        const centerX = 350; // コンテナの中心付近
        const centerY = 300;
        const radius = 220;

        const newNodes: Node[] = cameraIds.map((id, index) => {
          // -90度(上)からスタートするように調整
          const angle = (index / cameraIds.length) * 2 * Math.PI - Math.PI / 2;
          return {
            id: `camera-${id}`,
            type: "camera",
            position: {
              x: centerX + radius * Math.cos(angle) - 50, // -50はwidth/2
              y: centerY + radius * Math.sin(angle) - 50, // -50はheight/2
            },
            data: { label: `Camera ${id}` },
          };
        });

        // 位置取得用のマップ
        const nodeMap = new Map(newNodes.map((n) => [n.id, n]));
        const getNodePos = (id: string) => nodeMap.get(`camera-${id}`)?.position;

        // 3. エッジ生成
        // ハンドル割り当てのための管理マップ
        const usedSourceHandles = new Map<string, Set<number>>();
        const usedTargetHandles = new Map<string, Set<number>>();

        const getFreeHandle = (nodeId: string, idealAngle: number, type: "source" | "target") => {
          const idealIndex = Math.round((idealAngle / (2 * Math.PI)) * 12) % 12;
          const normalizedIdealIndex = idealIndex < 0 ? idealIndex + 12 : idealIndex;

          const usedMap = type === "source" ? usedSourceHandles : usedTargetHandles;
          if (!usedMap.has(nodeId)) usedMap.set(nodeId, new Set());
          const used = usedMap.get(nodeId)!;

          // 空いている最も近いハンドルを探す
          // 探索順: 0, +1, -1, +2, -2, ...
          for (let offset = 0; offset <= 6; offset++) {
            const checkIndices = offset === 0 ? [0] : [offset, -offset];
            for (const diff of checkIndices) {
              let idx = (normalizedIdealIndex + diff) % 12;
              if (idx < 0) idx += 12;

              if (!used.has(idx)) {
                used.add(idx);
                return idx;
              }
            }
          }
          return normalizedIdealIndex; // fallback
        };

        const newEdges = weights
          .map((w, i) => {
            const sourceId = `camera-${w.source_camera_id}`;
            const targetId = `camera-${w.target_camera_id}`;

            // 自己ループの場合
            if (sourceId === targetId) {
              // 上方向(-90度)を基準に空きを探す
              const handleIdx = getFreeHandle(sourceId, -Math.PI / 2, "source");
              // sourceとtargetで隣接させる
              // targetHandleもsourceHandleの隣（時計回り）を使ってみる
              // ただしCustomCurvedEdgeの制御点ロジックはsource/targetそれぞれの角度を見るので、
              // 離れた位置だと大きく膨らむ。隣接が一番自然。
              const targetHandleIdx = (handleIdx + 1) % 12;

              // targetHandleが使われていないかチェックすべきだが、
              // 自己ループ用の特別枠として使うか、getFreeHandleを使うか。
              // ここでは簡易的に隣接を使う。もし埋まってたら...まあ重なるだけ。

              // usedTargetHandlesにも登録しておく（念のため）
              if (!usedTargetHandles.has(targetId)) usedTargetHandles.set(targetId, new Set());
              usedTargetHandles.get(targetId)!.add(targetHandleIdx);

              return {
                id: `flow-${w.source_camera_id}-${w.target_camera_id}-${i}`,
                source: sourceId,
                target: targetId,
                sourceHandle: `source-${handleIdx}`,
                targetHandle: `target-${targetHandleIdx}`,
                label: `${w.weight} people`,
                type: "curved",
                animated: true,
                style: {
                  strokeWidth: Math.min(Math.max(w.weight / 10, 1), 10),
                  stroke: "#94a3b8",
                },
                markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
              };
            }

            const sourcePos = getNodePos(w.source_camera_id);
            const targetPos = getNodePos(w.target_camera_id);

            if (!sourcePos || !targetPos) return null;

            // 中心座標
            const sx = sourcePos.x + 50;
            const sy = sourcePos.y + 50;
            const tx = targetPos.x + 50;
            const ty = targetPos.y + 50;

            const angleToTarget = Math.atan2(ty - sy, tx - sx);
            const angleFromSource = Math.atan2(sy - ty, sx - tx); // Targetから見たSource

            const sourceHandleIdx = getFreeHandle(sourceId, angleToTarget, "source");
            const targetHandleIdx = getFreeHandle(targetId, angleFromSource, "target");

            return {
              id: `flow-${w.source_camera_id}-${w.target_camera_id}-${i}`,
              source: sourceId,
              target: targetId,
              sourceHandle: `source-${sourceHandleIdx}`,
              targetHandle: `target-${targetHandleIdx}`,
              label: `${w.weight} people`,
              type: "curved",
              animated: true,
              style: {
                strokeWidth: Math.min(Math.max(w.weight / 10, 2), 15),
                stroke: "#3b82f6",
              },
              markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" },
            };
          })
          .filter((e) => e !== null) as Edge[];

        setNodes(newNodes);
        setEdges(newEdges);
      } catch (error) {
        console.error("Failed to fetch person flow weights:", error);
      }
    };

    fetchData();
  }, [token, setNodes, setEdges]);

  return (
    <div className={styles.graphContainer}>
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
