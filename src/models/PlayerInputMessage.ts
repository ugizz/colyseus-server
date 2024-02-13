import { Quat, Vect3 } from "../rooms/schema/Schemas";

export class PlayerInputMessage {
  // 방향
  public readonly x: number;
  public readonly y: number;
  public readonly z: number;
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
