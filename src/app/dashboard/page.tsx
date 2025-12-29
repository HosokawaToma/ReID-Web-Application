"use client";

import PersonSnapshotList from "@/components/person_snapshot/list";
import PersonSnapshotSearchForm from "@/components/person_snapshot/search_form";
import { usePersonSnapshotSearch } from "@/hooks/personSnapshotSearch";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTokenContext } from "../context/TokenContext";

export default function Dashboard() {
  const router = useRouter();
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
    addPersonId,
  } = usePersonSnapshotSearch(token);

  useEffect(() => {
    if (!token) {
      router.push("/");
      return;
    }
    searchPersonSnapshots();
  }, [token, router, searchPersonSnapshots]);

  return (
    <main>
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
      <PersonSnapshotList personSnapshots={personSnapshots} onPersonIdClickAction={addPersonId} />
    </main>
  );
}
