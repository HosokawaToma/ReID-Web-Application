export interface PersonSnapshotMetaData {
  id: string;
  cameraId: number;
  viewId: number;
  timestamp: Date;
  isJunk: boolean;
  personId: string | null;
}

export interface PersonSnapshotAnswer {
  id: string;
  personId: string;
  isJunk: boolean;
}
