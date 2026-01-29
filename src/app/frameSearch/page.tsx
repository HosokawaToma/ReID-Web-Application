"use client";

import FrameSearchForm from "@/components/frameSearch/form";
import FrameSearchList from "@/components/frameSearch/list";
import FrameSearchScreen from "@/components/frameSearch/screen";
import { useFrameSearch } from "@/hooks/frameSearch";
import { useFrameSelect } from "@/hooks/frameSelect";
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
    frameImages,
    page,
    totalItems,
    totalPages,
    setIds,
    setCameraIds,
    setViewIds,
    setAfterTimestamp,
    setBeforeTimestamp,
    setSortOrderByTimestamp,
    searchFrames,
    searchFrameImage,
    setPage,
    setTotalItems,
    setTotalPages,
  } = useFrameSearch({ token });
  const { selectedFrameMetaData, selectedFrameImage, selectFrameById } = useFrameSelect({ frameMetaDatas: frames, frameImages: frameImages });

  useEffect(() => {
    if (frames.length > 0) {
      selectFrameById(frames[0].id);
    }
  }, [frames, selectFrameById]);

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
        <FrameSearchScreen frameMetadata={selectedFrameMetaData} frameImage={selectedFrameImage} />
        <FrameSearchList frameMetaDatas={frames} searchFrameImage={searchFrameImage} onItemClickAction={selectFrameById} page={page} totalItems={totalItems} totalPages={totalPages} setPage={setPage} searchFrames={searchFrames} />
      </div>
    </div>
  );
}
