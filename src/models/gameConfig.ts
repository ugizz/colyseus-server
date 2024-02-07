import { clamp } from "../helpers/Utility";

export class GameConfig {
  private _data: any = null;

  constructor(rawData: any = {}) {
    this._data = rawData;
  }
  // 최소 플레이어 수
  public get MinPlayers(): number {
    return this._data.minPlayers || 3;
  }
  // 최대 플레이어 수
  public get MaxPlayers(): number {
    return this._data.maxPlayers || 8;
  }
  // 준비 카운트다운
  public get PreRoundCountdown(): number {
    return this._data.preRoundCountdown || 5000;
  }
  // 프롤로그 카운트다운
  public get PrologueCountdown(): number {
    return this._data.prologueCountdown || 10000;
  }
  // 초기화 카운트다운
  public get InitializeCountdown(): number {
    return this._data.initializeCountdown || 1000;
  }
  // 흩어짐 카운트다운
  public get ScatterCountdown(): number {
    return this._data.scatterCountdown || 3000;
  }
  // 사냥 카운트다운
  public get HuntCountdown(): number {
    return this._data.huntCountdown || 30000;
  }
  // 술래 수
  public get SeekerCount(): number {
    return this._data.seekerCount || 1;
  }
  // 술래 승리 조건
  public get SeekerWinCondition(): number {
    const maxWinCondition: number = this.MaxPlayers - this.SeekerCount;

    const winCondition: number = clamp(
      this._data.seekerWinCondition || maxWinCondition,
      1,
      maxWinCondition
    );

    return winCondition;
  }
  // 게임 오버 카운트다운
  public get GameOverCountdown(): number {
    return this._data.gameOverCountdown || 10000;
  }
  // 플레이어 이동 속도
  public get PlayerMovementSpeed(): number {
    return this._data.playerMovementSpeed || 1;
  }
  // 술래 이동 속도
  public get SeekerMovementBoost(): number {
    return this._data.seekerMovementBoost || 0.1;
  }
  // 술래가 시민을 잡을 수 있는 최대 거리
  public get SeekerCheckDistance(): number {
    return this._data.seekerCheckDistance || 2;
  }
  // 술래 시야각
  public get SeekerFOV(): number {
    return this._data.seekerFOV || 60;
  }
  // 술래 목표
  public get SeekerGoal(): string {
    return this._data.seekerGoal || "TODO: Seeker Goal";
  }
  // 시민 목표
  public get HiderGoal(): string {
    return this._data.hiderGoal || "TODO: Hider Goal";
  }
}
