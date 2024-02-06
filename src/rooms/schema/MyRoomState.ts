import { Schema, Context, type, MapSchema } from "@colyseus/schema";
import { PlayerState } from "./PlayerState";
import { MyGameState } from "./MyGameState";
import { MyRoom } from "../MyRoom";
import { GameConfig } from "../../models/gameConfig";

export class MyRoomState extends Schema {
  // 플레이어 목록
  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
  // 게임 상태
  @type(MyGameState) gameState: MyGameState;

  private _room: MyRoom = null;
  private _availableSpawnPoints: number[] = null;
  private _config: GameConfig;

  constructor(room: MyRoom, ...args: any[]) {
    super(...args);

    this._room = room;
    this.gameState = new MyGameState(room, this._config);
  }

  // 게임 상태 업데이트
  public update(deltaTime: number) {
    this.gameState.update(deltaTime);
  }
}
