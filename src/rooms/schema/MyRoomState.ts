import { Schema, Context, MapSchema } from "@colyseus/schema";
import { PlayerState } from "./PlayerState";
import { MyGameState } from "./MyGameState";
import { MyRoom } from "../MyRoom";
import { GameConfig } from "../../models/gameConfig";
import { distanceBetweenPlayers, random } from "../../helpers/Utility";

const type = Context.create();

export class MyRoomState extends Schema {
  // 플레이어 목록
  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
  // 게임 상태
  @type(MyGameState) gameState: MyGameState;

  // 방
  private _room: MyRoom = null;
  // 스폰 지점
  private _availableSpawnPoints: number[] = null;
  // 게임 설정
  private _config: GameConfig;

  constructor(room: MyRoom, ...args: any[]) {
    super(...args);

    // 방 설정
    this._room = room;
    // 플레이어 목록 초기화
    this.initializeSpawnPoints();
    // 게임 상태를 설정
    this._config = args[0];
    this.gameState = new MyGameState(room, this._config);
  }

  // 게임 상태 업데이트
  public update(deltaTime: number) {
    this.gameState.update(deltaTime);
  }

  // public seekerAttackHider(seekerId: string) {
  //   const seeker: PlayerState = this.players.get(seekerId);
  //   this.players.forEach((player: PlayerState) => {
  //     if (player.isCaptured || player.isSeeker) {
  //       return;
  //     }
  //     const distance: number = distanceBetweenPlayers(seeker, player);
  //     if (distance <= this._config.SeekerCheckDistance) {
  //       this.gameState.seekerCapturedHider(player);
  //     }
  //   });
  //   return;
  // }
  // 술래가 시민을 공격
  public seekerAttackHider(seekerId: string, hiderId: string) {
    const seeker: PlayerState = this.players.get(seekerId);
    const hider: PlayerState = this.players.get(hiderId);
    // 만약 술래와 시민이 있다면
    if (seeker && hider) {
      // 시민과 술래의 거리를 계산
      const distance: number = distanceBetweenPlayers(seeker, hider);
      // 만약 거리가 술래의 공격 거리보다 작다면
      if (distance <= this._config.SeekerCheckDistance) {
        // 시민을 잡음
        this.gameState.seekerCapturedHider(hider);
      }
    }
    return;
  }
  // 스폰 지점 초기화
  private initializeSpawnPoints() {
    this._availableSpawnPoints = [];

    if (this._room.maxClients > 10) {
      console.error(`최대 플레이어 수가 10명을 넘을 수 없음!!`);
      return;
    }

    // 스폰 지점을 설정
    for (let i: number = 0; i < this._room.maxClients - 1; i++) {
      this._availableSpawnPoints.push(i);
    }

    // //console.log(`Spawn Points: %o`, this._availableSpawnPoints);
  }
  // 스폰 지점 인덱스 가져오기
  public getSpawnPointIndex(isRandom: boolean = true): number {
    if (this._availableSpawnPoints.length === 0) {
      console.error(`스폰지점이 전부 사용중!`);
      return -1;
    }

    let index: number = 0;

    if (isRandom) {
      index = random(0, this._availableSpawnPoints.length - 1);
    }

    return this._availableSpawnPoints.splice(index, 1)[0];
  }

  public freeUpSpawnPointIndex(playerState: PlayerState) {
    const spawnPoint: number = playerState.spawnPoint;

    // if (playerState.isSeeker) {
    //   return;
    // }

    // if (spawnPoint < 0 || spawnPoint > this._room.maxClients - 2) {
    //   return;
    // }

    // 플레이어의 스폰 지점을 초기화
    playerState.spawnPoint = -1;

    this._availableSpawnPoints.push(spawnPoint);
  }

  public resetForPlay() {
    // this.initializeSpawnPoints();

    this.players.forEach((player: PlayerState) => {
      player.resetPlayer();
    });
  }

  public seekerLeft() {
    this.gameState.seekerLeft();
  }
}
