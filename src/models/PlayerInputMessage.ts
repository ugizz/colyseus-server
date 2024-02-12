import { Quat, Vect3 } from "../rooms/schema/Schemas";

export class PlayerInputMessage {
  // 방향
  public readonly direction: Vect3;
  // 위치
  public readonly position: Quat;
}
