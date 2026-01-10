"use client";

import PersonSnapshotList from "@/components/person_snapshot/list";
import PersonSnapshotSearchForm from "@/components/person_snapshot/search_form";
import { usePersonSnapshotSearch } from "@/hooks/personSnapshotSearch";
import { useEffect } from "react";
import { useTokenContext } from "../context/TokenContext";

export default function PersonSnapshotsSearch() {
  const { token } = useTokenContext();
  const {
    personIds,
    cameraIds,
    viewIds,
    isJunk,
    afterTimestamp,
    beforeTimestamp,
    sortOrderByTimestamp,
    personSnapshots,
    setPersonIds,
    setCameraIds,
    setViewIds,
    setIsJunk,
    setAfterTimestamp,
    setBeforeTimestamp,
    setSortOrderByTimestamp,
    searchPersonSnapshots,
    searchPersonSnapshotImage,
    addPersonId,
  } = usePersonSnapshotSearch(token);

  useEffect(() => {
    if (personSnapshots.length > 0) return;
    searchPersonSnapshots();
  }, [personSnapshots, searchPersonSnapshots]);

  return (
  <div style={{ width: "80%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
    <PersonSnapshotSearchForm
      personIds={personIds}
      cameraIds={cameraIds}
      viewIds={viewIds}
      isJunk={isJunk}
      afterTimestamp={afterTimestamp}
      beforeTimestamp={beforeTimestamp}
      sortOrderByTimestamp={sortOrderByTimestamp}
      setPersonIds={setPersonIds}
      setCameraIds={setCameraIds}
      setViewIds={setViewIds}
      setIsJunk={setIsJunk}
      setAfterTimestamp={setAfterTimestamp}
      setBeforeTimestamp={setBeforeTimestamp}
      setSortOrderByTimestamp={setSortOrderByTimestamp}
      personIdsOption={[]}
      cameraIdsOption={[]}
      viewIdsOption={[]}
      onSubmitAction={searchPersonSnapshots}
    />
    <PersonSnapshotList personSnapshots={personSnapshots} searchPersonSnapshotImage={searchPersonSnapshotImage} onClickAction={addPersonId} />
  </div>
  );
}
