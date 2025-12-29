export interface PersonSnapshot {
  id: string;
  cameraId: number;
  viewId: number;
  timestamp: Date;
  isJunk: boolean;
  personId: string | null;
  imageBlob: Blob | null;
}
