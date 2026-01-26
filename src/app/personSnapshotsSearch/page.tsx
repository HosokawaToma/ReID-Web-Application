"use client";

import PersonSnapshotList from "@/components/personSnapshot/list";
import PersonSnapshotSearchForm from "@/components/personSnapshot/search_form";
import { usePersonSnapshotSearch } from "@/hooks/personSnapshotSearch";
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
