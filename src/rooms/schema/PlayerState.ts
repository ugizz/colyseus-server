import { Schema, Context } from "@colyseus/schema";
import { Client } from "colyseus";
import { Quat, Vect3 } from "./Schemas";
import { PlayerInputMessage } from "../../models/PlayerInputMessage";

const type = Context.create();

export class PlayerState extends Schema {
  // 플레이어 ID
  @type("string") id: string = "ID";
  // 플레이어 닉네임
  @type("string") nickname: string = "";
  // 플레이어 색상
  @type("string") color: string = "White";
  // 방장 여부
  @type("boolean") isHost: boolean = false;
  // 플레이어 준비 여부
  @type("boolean") isReady: boolean = false;
  // 술래 여부
  @type("boolean") isSeeker: boolean = false;
  // 플레이어 이동 가능 여부
  @type("boolean") canMove: boolean = true;
  // 플레이어 잡혔는지 여부
  @type("boolean") isCaptured: boolean = false;
  // 스폰 지점
  @type("float32") spawnPoint: number = -1;

  // 플레이어 위치
  @type("float32") xPos: number = 0.0;
  @type("float32") yPos: number = 0.0;
  @type("float32") zPos: number = 0.5;
  @type("float32") positionTimestamp: number = 0.0;

  private _client: Client = null;

  private accessToken: string = "";

  public get AccessToken() {
    return this.accessToken;
  }

  constructor(client: Client, ...args: any[]) {
    super(args);
    this._client = client;
  }
  // 클라이언트 연결 해제
  public disconnect() {
    this._client.leave();
  }
  // 플레이어 초기화
  public resetPlayer() {
    // 이동 가능 여부
    this.canMove = true;
    // 잡혔는지 여부
    this.isCaptured = false;
    // 술래 여부
    this.isSeeker = false;
    // 준비 여부
    this.isReady = true;
    // 스폰 지점
    this.spawnPoint = -1;
    // 위치에 이동한 시간
    this.positionTimestamp = 0;
  }
  // 플레이어 닉네임 설정
  public setNickname(nickname: string) {
    this.nickname = nickname;
  }
  // 플레이어 위치 설정
  public setPosition(position: PlayerInputMessage) {
    this.xPos = position.x;
    this.yPos = position.y;
    this.zPos = position.z;
  }
}
