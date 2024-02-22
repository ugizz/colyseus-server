import { Schema, Context } from "@colyseus/schema";
import { MyRoom } from "../MyRoom";
import { GameConfig } from "../../models/gameConfig";
import { PlayerState } from "./PlayerState";
import { clamp, random } from "../../helpers/Utility";
import axios from "axios";
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
const type = Context.create();
export class MyGameState extends Schema {
  // 게임 현재 상태
  @type("string") currentState: GameState = GameState.NONE;
  // 술래가 이겼는지 여부
  @type("boolean") seekerWon: boolean = false;
  // 남은 시간 카운트다운
  @type("int32") countdown: number = 0;

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
    hider.canMove = true;
    // 잡힌 플레이어 목록에 추가
    this._capturedPlayers.set(hider.id, hider);
  }

  public seekerLeft() {
    if (this.currentState === GameState.HUNT) {
      this.seekerWon = false;
      let seekerCount: number = 0;
      this._room.state.players.forEach((player: PlayerState) => {
        if (player.isSeeker) seekerCount++;
      });
      // 모든 술래가 게임을 떠났다면, 게임 종료 상태로 변경
      if (seekerCount === 0) {
        this.seekerWon = false;
        this.moveToNextState(GameState.GAME_OVER);
      }
    }
  }

  public update(deltaTime: number) {
    switch (this.currentState) {
      case GameState.NONE:
        // 게임 상태를 기다리는 상태로 변경
        // 레디 기능 삭제로 인해 주석 처리
        // this.moveToNextState(GameState.WAIT_FOR_START);
        break;
      // 카운트다운 기능 삭제로 인해 주석 처리
      // case GameState.CLOSE_COUNTDOWN:
      // 게임 상태를 CLOSE_COUNTDOWN로 변경
      // this.closeRoomCountdown();
      // break;
      case GameState.INITIALIZE:
        this.initializeRoundOfPlay();
        break;
      case GameState.PROLOGUE:
        this.prologue();
        break;
      case GameState.SCATTER:
        this.scatterCountdown();
        break;
      case GameState.HUNT:
        this.hunt();
        break;
      case GameState.GAME_OVER:
        this.gameOver();
        break;
    }
  }

  public moveToNextState(nextState: GameState) {
    this.currentState = nextState;
    switch (nextState) {
      case GameState.NONE:
        console.log("none");
        // 게임 상태를 초기화
        this._stateTimestamp = 0;
        this.countdown = 0;
        this.seekerWon = false;
        this._capturedPlayers.clear();
        this._room.state.resetForPlay();
        this._room.state.players.forEach((player: PlayerState) => {
          player.resetPlayer();
        });
        if (this._room.maxClients != this._room.state.players.size)
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
          // player.spawnPoint = this._room.state.getSpawnPointIndex();
          player.isSeeker = true;
          player.canMove = false;
        }

        // 플레이어들의 스폰 지점을 초기화
        // for (let i = 0; i < players.length; i++) {
        //   players[i].spawnPoint = this._room.state.getSpawnPointIndex();
        //   players[i].isSeeker = false;
        // }

        // 모든 플레이어를 움직일 수 없도록 설정
        this._room.state.players.forEach((player: PlayerState) => {
          if (!player.isSeeker) {
            player.canMove = true;
          }
        });
        break;
      case GameState.PROLOGUE:
        console.log("prologue");
        // 게임 상태 변경 시간을 설정
        this._stateTimestamp = Date.now();
        break;
      case GameState.SCATTER:
        console.log("scatter");
        // 시민들이 흩어질 수 있도록 설정
        this._room.state.players.forEach((player: PlayerState) => {
          // 술래가 아닌 플레이어들만 움직일 수 있도록 설정
          if (!player.isSeeker) {
            player.canMove = true;
          } else {
            player.canMove = false;
          }
        });
        break;
      case GameState.HUNT:
        console.log("hunt");
        try {
          // 배열 복사
          const players: PlayerState[] = Array.from(
            this._room.state.players.values()
          );
          // 술래들이 움직일 수 있도록 설정
          players.forEach((player: PlayerState) => {
            if (player.isSeeker) {
              player.canMove = true;
            }
          });
        } catch (error: any) {
          console.error(`${error.stack}`);
        }
        // 카운트다운 설정
        this.countdown = this._config.HuntCountdown / 1000;
        // 사냥 시간을 설정하기 위해 게임 상태 변경 시간을 현재로 설정
        this._stateTimestamp = Date.now();

        break;
      case GameState.GAME_OVER:
        console.log(this._room.roomId + "game over");
        // 초기화 상태로 변경
        this._room.state.players.forEach((player: PlayerState) => {
          if (player.AccessToken !== "" && player.AccessToken !== undefined) {
            axios.post(
              "https://api.ugizz.store/game/result",
              {
                roleId: player.isSeeker ? 1 : 2,
                userSession: player.id,
                roomSession: this._room.roomId,
                isWin:
                  this.seekerWon && player.isSeeker
                    ? true
                    : this.seekerWon && !player.isSeeker
                    ? false
                    : !this.seekerWon && player.isSeeker
                    ? false
                    : true,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${player.AccessToken}`,
                },
              }
            );
          }
          player.canMove = true;
          player.isSeeker = false;
          player.isCaptured = false;
        });
        // 카운트다운 설정
        this.countdown = this._config.GameOverCountdown / 1000;
        // 게임 상태 변경 시간을 설정
        this._stateTimestamp = Date.now();
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
  // 방을 닫음
  // 이 메서드는 사용하지 않음
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
  // 라운드 초기화
  // 라운드를 초기화하고 게임 시작함
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
  // 프롤로그
  // 게임 시작 전 준비 시간
  // 4초간 역할 배정을 보여주고, 다음 6초간 플레이어들이 흩어지는 시간
  // 총 10초간의 시간이 소요됨
  // 이 시간동안 술래 플레이어들은 움직일 수 없음
  private prologue() {
    // 소요된 시간
    let elapsedTime: number = Date.now() - this._stateTimestamp;
    // 프롤로그 카운트다운
    const countdown: number = this._config.PrologueCountdown;
    // 소요된 시간이 카운트다운보다 작다면, 카운트다운 설정
    if (elapsedTime < countdown - this._config.ScatterCountdown) {
      this.setCountdown(countdown - elapsedTime, countdown);
      return;
    }
    // 소요된 시간이 카운트다운보다 크다면, 흩어짐 상태로 변경
    this.moveToNextState(GameState.SCATTER);
  }
  // 흩어짐
  private scatterCountdown() {
    // 경과된 시간
    let elapsedTime: number = Date.now() - this._stateTimestamp;
    // 흩어짐 카운트다운
    const countdown: number = this._config.PrologueCountdown;
    // 경과된 시간이 카운트다운보다 작다면, 카운트다운 설정
    if (elapsedTime < countdown) {
      this.setCountdown(countdown - elapsedTime, countdown);
      return;
    }
    // 경과된 시간이 카운트다운보다 크다면, 사냥 상태로 변경
    this.moveToNextState(GameState.HUNT);
  }
  // 사냥
  private hunt() {
    // 경과된 시간
    let elapsedTime: number = Date.now() - this._stateTimestamp;
    // 사냥 카운트다운
    const countdown: number = this._config.HuntCountdown;
    // 카운트 다운 설정
    this.setCountdown(countdown - elapsedTime, countdown);
    // 술래가 승리했는지 확인
    this.seekerWon = this._capturedPlayers.size >= this.WinCondition;
    // 만약 술래가 승리했다면, 게임 종료 상태로 변경
    // 만약 술래가 승리하지 않았다면, 리턴
    if (!this.seekerWon && elapsedTime < countdown) {
      return;
    }
    // 게임 종료 상태로 변경
    this.moveToNextState(GameState.GAME_OVER);
  }

  // 게임 종료
  private gameOver() {
    // 경과된 시간
    let elapsedTime: number = Date.now() - this._stateTimestamp;
    // 게임 오버 카운트다운
    const countdown: number = this._config.GameOverCountdown;
    // 경과된 시간이 카운트다운보다 작다면, 카운트다운 설정
    if (elapsedTime < countdown) {
      this.setCountdown(countdown - elapsedTime, countdown);
      return;
    }
    // 게임 상태를 기다리는 상태로 변경
    this.moveToNextState(GameState.NONE);
  }

  // 카운트다운 설정
  // timeMs: 경과된 시간
  // maxMs: 허용된 최대 시간
  private setCountdown(timeMs: number, maxMs: number) {
    this.countdown = Math.ceil(clamp(timeMs, 0, maxMs) / 1000);
  }
}
