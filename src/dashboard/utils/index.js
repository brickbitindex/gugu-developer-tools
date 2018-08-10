/* eslint no-bitwise: 0 */
export function getUuid() {
  return 'xxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function JSONDecoder(json) {
  return JSON.parse(json);
}
