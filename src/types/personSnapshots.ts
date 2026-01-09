export interface PersonSnapshotMetaData {
  id: string;
  cameraId: number;
  viewId: number;
  timestamp: Date;
  isJunk: boolean;
  personId: string | null;
}
