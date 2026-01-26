"use client";

import PersonSnapshotList from "@/components/personSnapshot/list";
import PersonSnapshotSearchForm from "@/components/personSnapshot/search_form";
import styles from "@/components/styles/index.module.css";
import { usePersonSnapshotSearch } from "@/hooks/personSnapshotSearch";
import { usePersonSnapshotSearchRank } from "@/hooks/personSnapshotSearchRank";
import { useEffect, useState } from "react";
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

  const {
    personSnapshotId: rankPersonSnapshotId,
    personSnapshots: rankPersonSnapshots,
    setPersonSnapshotId: setRankPersonSnapshotId,
    searchPersonSnapshotRank,
    searchPersonSnapshotImage: searchRankPersonSnapshotImage,
  } = usePersonSnapshotSearchRank(token);

  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);

  const handleShowRanking = async (personSnapshotId: string) => {
    setRankPersonSnapshotId(personSnapshotId);
    setIsRankingModalOpen(true);
  };

  useEffect(() => {
    if (isRankingModalOpen && rankPersonSnapshotId) {
      searchPersonSnapshotRank();
    }
  }, [isRankingModalOpen, rankPersonSnapshotId, searchPersonSnapshotRank]);

  const handleCloseModal = () => {
    setIsRankingModalOpen(false);
  };

  return (
    <>
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
        <PersonSnapshotList
          personSnapshots={personSnapshots}
          searchPersonSnapshotImage={searchPersonSnapshotImage}
          onClickAction={addPersonId}
          onShowRanking={handleShowRanking}
        />
      </div>
      {isRankingModalOpen && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "var(--spacing-large)", width: "80vw", maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-medium)" }}>
                <h2 style={{ margin: 0, fontSize: "var(--font-size-medium)" }}>Ranking Results</h2>
                <button
                  onClick={handleCloseModal}
                  className={styles.defaultButton}
                  style={{ width: "auto", padding: "var(--spacing-small) var(--spacing-medium)" }}
                >
                  Close
                </button>
              </div>
              <div style={{ overflow: "auto", flex: 1 }}>
                <PersonSnapshotList
                  personSnapshots={rankPersonSnapshots}
                  searchPersonSnapshotImage={searchRankPersonSnapshotImage}
                  onClickAction={() => {}}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
