export function isInputLocked({ snapping, cascadeActive }) {
  return Boolean(snapping || cascadeActive);
}
