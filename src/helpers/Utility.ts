import { PlayerState } from "../rooms/schema/PlayerState";

// value가 min과 max 사이에 있는지 확인
// 만약 value가 min보다 작다면 min을 반환
// 만약 value가 max보다 크다면 max를 반환
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function random(min: number, max: number): number {
  return Math.floor(Math.random() * max + min);
}

export function distanceBetweenPlayers(a: PlayerState, b: PlayerState): number {
  return Math.sqrt(
    Math.pow(a.xPos - b.xPos, 2) +
      Math.pow(a.yPos - b.yPos, 2) +
      Math.pow(a.zPos - b.zPos, 2)
  );
}

export function delay(delay: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
