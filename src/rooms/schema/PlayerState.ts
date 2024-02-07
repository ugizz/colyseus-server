import { Schema, type } from "@colyseus/schema";
import { Client } from "colyseus";

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
  @type("boolean") canMove: boolean = false;
  // 플레이어 잡혔는지 여부
  @type("boolean") isCaptured: boolean = false;
  // 스폰 지점
  @type("number") spawnPoint: number = -1;

  // 플레이어 위치
  @type("number") xPos: number = 0.0;
  @type("number") yPos: number = 0.5;
  @type("number") zPos: number = 0.0;
  @type("number") positionTimestamp: number = 0.0;

  // 플레이어 방향
  @type("number") xDir: number = 0.0;
  @type("number") yDir: number = 0.5;
  @type("number") zDir: number = 0.0;

  private _client: Client = null;

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
    this.canMove = false;
    this.isCaptured = false;
    this.isSeeker = false;
    this.isReady = false;
    this.spawnPoint = -1;
    this.positionTimestamp = 0;
  }
  // 플레이어 닉네임 설정
  public setNickname(nickname: string) {
    this.nickname = nickname;
  }
  // 플레이어 위치 설정
  public setPosition(position: number[], positionTimestamp: number) {
    this.xPos = position[0];
    this.yPos = position[1];
    this.zPos = position[2];

    this.positionTimestamp = positionTimestamp;
  }
  // 플레이어 방향 설정
  public setDirection(direction: number[]) {
    this.xDir = direction[0];
    this.yDir = direction[1];
    this.zDir = direction[2];
  }
}
