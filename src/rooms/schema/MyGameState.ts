import { Schema, type } from "@colyseus/schema";
import { MyRoom } from "../MyRoom";
import { GameConfig } from "../../models/gameConfig";
import { PlayerState } from "./PlayerState";
import { clamp, random } from "../../helpers/Utility";

export enum GameState {
  // 게임 상태
  NONE = "none",
  // 게임 시작을 기다리는 상태
  WAIT_FOR_START = "waitForStart",
  // 게임 시작 카운트 다운 상태
  CLOSE_COUNTDOWN = "closeCountdown",
  // 게임 초기화 상태
  INITIALIZE = "initialize",
  // 게임 시작 상태 (역할 배정, 게임 시작 카운트 다운, 게임 시작)
  PROLOGUE = "prologue",
  // 게임 시작 상태 (술래가 움직이기 전에 시민들이 흩어지는 시간)
  SCATTER = "scatter",
  // 게임 시작 상태 (사냥 시작, 술래가 움직이기 시작)
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

  public seekerLeft() {
    if (this.currentState === GameState.HUNT) {
      this.seekerWon = false;
      // 모든 술래가 게임을 떠났다면, 게임 종료 상태로 변경
      if (this._room.state.players.size <= this._config.SeekerCount) {
        this.moveToNextState(GameState.GAME_OVER);
      }
    }
  }

  public update(deltaTime: number) {
    switch (this.currentState) {
      case GameState.NONE:
        this.moveToNextState(GameState.WAIT_FOR_START);
        break;
      case GameState.CLOSE_COUNTDOWN:
        this.closeRoomCountdown();
        break;
      case GameState.INITIALIZE:
        this.initializeRoundOfPlay();
        break;
      case GameState.PROLOGUE:
        this.prologue();
        break;
      case GameState.SCATTER:
        this.scatterCountdown();
        break;
    }
  }

  public moveToNextState(nextState: GameState) {
    switch (nextState) {
      case GameState.NONE:
        // 게임 상태를 초기화
        this._stateTimestamp = 0;
        this.countdown = 0;
        this.seekerWon = false;
        this._capturedPlayers.clear();
        this._room.unlock();
        break;
      case GameState.CLOSE_COUNTDOWN:
        // 게임 상태를 CLOSE_COUNTDOWN로 변경
        // 게임 상태 변경 시간을 설정
        this._stateTimestamp = Date.now();
        // 카운트다운 설정
        this.countdown = this._config.PreRoundCountdown / 1000;
        break;
      case GameState.INITIALIZE:
        // 게임 상태를 INITIALIZE로 변경
        // 게임 상태 변경 시간을 설정
        this._stateTimestamp = Date.now();
        // 새로운 유저가 입장하지 못하도록 방 잠금
        this._room.lock();

        // 랜덤으로 술래를 정함
        const players: PlayerState[] = Array.from(
          this._room.state.players.values()
        );

        // 술래 수만큼 랜덤으로 술래를 정함
        for (let i = 0; i < this._config.SeekerCount; i++) {
          const index: number = random(0, players.length);

          // 술래를 players 배열에서 제거
          const player: PlayerState = players.splice(index, 1)[0];
          player.spawnPoint = this._room.state.getSpawnPointIndex();
          player.isSeeker = true;
        }

        // 플레이어들의 스폰 지점을 초기화
        for (let i = 0; i < players.length; i++) {
          players[i].spawnPoint = this._room.state.getSpawnPointIndex();
          players[i].isSeeker = false;
        }

        // 모든 플레이어를 움직일 수 없도록 설정
        this._room.state.players.forEach((player: PlayerState) => {
          if (!player.isSeeker) {
            player.canMove = false;
          }
        });
        break;
      case GameState.PROLOGUE:
        // 게임 상태 변경 시간을 설정
        this._stateTimestamp = Date.now();
        break;
      case GameState.SCATTER:
        // Allow all the Hiders to begin moving
        this._room.state.players.forEach((player: PlayerState) => {
          if (!player.isSeeker) {
            player.canMove = true;
          }
        });
        break;
    }
  }

  public waitForStart(): boolean {
    // 모든 플레이어가 준비 상태가 아니라면 리턴
    let allReady: boolean = true;
    this._room.state.players.forEach((player: PlayerState) => {
      if (!player.isReady) {
        allReady = false;
      }
    });
    if (!allReady) return false;
    return true;
  }

  private closeRoomCountdown() {
    let elapsedTime: number = Date.now() - this._stateTimestamp;
    const countdown: number = this._config.PreRoundCountdown;

    if (elapsedTime < countdown) {
      this.setCountdown(countdown - elapsedTime, countdown);
      return;
    }
    this.countdown = 0;
    this.moveToNextState(GameState.INITIALIZE);
  }

  private initializeRoundOfPlay() {
    let elapsedTime: number = Date.now() - this._stateTimestamp;
    const countdown: number = this._config.InitializeCountdown;

    if (elapsedTime < countdown) {
      this.setCountdown(countdown - elapsedTime, countdown);
      return;
    }

    this.countdown = 0;
    this.moveToNextState(GameState.PROLOGUE);
  }

  private prologue() {
    let elapsedTime: number = Date.now() - this._stateTimestamp;
    const countdown: number = this._config.PrologueCountdown;

    if (elapsedTime < countdown - this._config.ScatterCountdown) {
      this.setCountdown(countdown - elapsedTime, countdown);
      return;
    }

    this.moveToNextState(GameState.SCATTER);
  }

  private scatterCountdown() {
    let elapsedTime: number = Date.now() - this._stateTimestamp;
    const countdown: number = this._config.PrologueCountdown;

    if (elapsedTime < countdown) {
      this.setCountdown(countdown - elapsedTime, countdown);

      return;
    }

    this.moveToNextState(GameState.HUNT);
  }

  private setCountdown(timeMs: number, maxMs: number) {
    this.countdown = Math.ceil(clamp(timeMs, 0, maxMs) / 1000);
  }
}
