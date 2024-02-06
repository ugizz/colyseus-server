import { Schema, type } from "@colyseus/schema";
import { MyRoom } from "../MyRoom";
import { GameConfig } from "../../models/gameConfig";
import { PlayerState } from "./PlayerState";

export enum GameState {
  // 게임 상태
  NONE = "none",
  // 게임 시작을 기다리는 상태
  WAIT_FOR_START = "waitForStart",
  // 게임 초기화 상태
  INITIALIZE = "initialize",
  // 게임 시작 상태 (역할 배정, 게임 시작 카운트 다운, 게임 시작)
  PROLOGUE = "prologue",
  // 게임 시작 상태 (시민들이 흩어지는 상태)
  SCATTER = "scatter",
  // 게임 시작 상태 (사냥 시작)
  HUNT = "hunt",
  // 게임 종료 상태
  GAME_OVER = "gameOver",
}

export class MyGameState extends Schema {
  // 게임 현재 상태
  @type("string") currentState: GameState = GameState.NONE;
  // 술래가 이겼는지 여부
  @type("boolean") seekerWon: boolean = false;
  // 남은 시간 카운트다운
  @type("number") countdown: number = 0;

  // 방
  private _room: MyRoom = null;
  // 마지막 상태
  private _lastState: GameState = GameState.NONE;
  // 게임 설정
  private _config: GameConfig = null;
  // 상태가 변경된 시간
  private _stateTimestamp: number = 0;
  // 잡힌 플레이어 목록
  private _capturedPlayers: Map<string, PlayerState> = null;

  constructor(room: MyRoom, config: GameConfig, ...args: any[]) {
    super(...args);
    this._room = room;
    this._config = config;
    this._capturedPlayers = new Map<string, PlayerState>();
  }

  // 승리 조건
  private get WinCondition(): number {
    // 승리 조건을 설정
    let winCondition: number = this._config.SeekerWinCondition;
    const hiderCount: number =
      this._room.state.players.size - this._config.SeekerCount;
    // 만약 플레이어 수가 승리 조건보다 적다면, 플레이어 수를 승리 조건으로 설정
    return hiderCount < winCondition ? hiderCount : winCondition;
  }

  public seekerCapturedHider(hider: PlayerState) {
    // 만약 현재 상태가 HUNT가 아니거나, 시민이 없다면 리턴
    if (this.currentState !== GameState.HUNT || !hider) return;
    hider.isCaptured = true;
    hider.canMove = false;
    // 잡힌 플레이어 목록에 추가
    this._capturedPlayers.set(hider.nickname, hider);
  }
  public update(deltaTime: number) {}
}
