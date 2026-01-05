export interface Frame {
  id: string;
  cameraId: number;
  viewId: number;
  timestamp: Date;
  imageBlob: Blob | null;
}
