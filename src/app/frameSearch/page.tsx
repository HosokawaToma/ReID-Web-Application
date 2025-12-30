"use client";

import FrameSearchForm from "@/components/frameSearch/form";
import FrameSearchList from "@/components/frameSearch/list";
import FrameSearchScreen from "@/components/frameSearch/screen";
import { useFrameSearch } from "@/hooks/frameSearch";
import { useEffect } from "react";
import { useTokenContext } from "../context/TokenContext";


export default function FrameSearch() {
  const { token } = useTokenContext();
  const {
    ids,
    cameraIds,
    viewIds,
    afterTimestamp,
    beforeTimestamp,
    sortOrderByTimestamp,
    frames,
    setIds,
    setCameraIds,
    setViewIds,
    setAfterTimestamp,
    setBeforeTimestamp,
    setSortOrderByTimestamp,
    searchFrames,
  } = useFrameSearch(token);

  useEffect(() => {
    searchFrames();
  }, [searchFrames]);

  return (
    <div
      style={{
        width: "80%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        gap: "10px",
        padding: "10px",
        boxSizing: "border-box",
      }}>
      <FrameSearchForm
        ids={ids}
        cameraIds={cameraIds}
        viewIds={viewIds}
        afterTimestamp={afterTimestamp}
        beforeTimestamp={beforeTimestamp}
        sortOrderByTimestamp={sortOrderByTimestamp}
        setIds={setIds}
        setCameraIds={setCameraIds}
        setViewIds={setViewIds}
        setAfterTimestamp={setAfterTimestamp}
        setBeforeTimestamp={setBeforeTimestamp}
        setSortOrderByTimestamp={setSortOrderByTimestamp}
        onSubmitAction={searchFrames}
      />
      <div
        style={{
          minHeight: 0,
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          boxSizing: "border-box"
        }}>
        <FrameSearchScreen frame={frames.length > 0 ? frames[0] : null} />
        <FrameSearchList frames={frames} onFrameClickAction={null} />
      </div>
    </div>
  );
}
