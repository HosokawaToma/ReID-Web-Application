export const toDateInputString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const toTimeInputString = (date: Date): string => {
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${min}`;
};

export const toDateTime = (dateStr: string, timeStr: string): Date => {
  return new Date(`${dateStr}T${timeStr}`);
};

/**
 * ローカル時刻成分を維持したまま、タイムゾーンオフセット付きISO文字列を生成する。
 *
 * 例（JST環境）: "2026-01-05T10:15:30.123+09:00"
 * - `Date#toISOString()` のようにUTC(Z)へ変換しないため、検索条件の時刻ズレを防げる。
 */
export const timestampToString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  const ms = String(date.getMilliseconds()).padStart(3, "0");

  return `${y}-${m}-${d}T${hh}:${mm}:${ss}.${ms}`;
};
