import { Room, Client } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
import { PlayerState } from "./schema/PlayerState";
import { PlayerInputMessage } from "../models/PlayerInputMessage";
import gameConfig from "../gameConfig";
import { GameConfig } from "../models/gameConfig";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  _config: GameConfig;

  // 방이 생성될 때 호출되는 메서드
  onCreate(options: any) {
    // 방의 상태를 MyRoomState로 설정.
    this.setState(new MyRoomState(this, this._config));
    this._config = new GameConfig(options);

    // 게임 상태를 업데이트하는 로직을 실행하기 위해 핸들러를 등록.
    this.registerHandlers();

    // 패치율은 클라이언트에게 게임 상태를 전송하는 속도로, 이 속도에 따라 클라이언트가 게임 상태를 업데이트.
    this.setPatchRate(16);

    // 시뮬레이션 간격은 게임의 로직을 실행하는 간격으로, 이 간격에 따라 게임의 로직이 실행.
    this.setSimulationInterval((dt) => {
      this.state.update(dt / 1000);
    });
  }

  // 클라이언트가 방에 참가했을 때 호출되는 메서드
  onJoin(client: Client, options: any) {
    // 클라이언트가 방에 참가했을 때, 로그를 출력.
    console.log(client.sessionId, " ", options.nickname, "joined!");

    // 클라이언트의 상태를 PlayerState로 설정.
    const player = new PlayerState(client).assign({
      id: client.sessionId,
      nickname: options.nickname,
      color: options.color,
    });
    // 클라이언트의 상태를 저장.
    this.state.players.set(client.sessionId, player);
    // 클라이언트에게 게임 설정을 전송.
    client.send("config", gameConfig);
  }

  // 클라이언트가 방을 떠났을 때 호출되는 메서드
  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    // 클라이언트가 방을 떠났을 때, 클라이언트의 상태를 삭제.
    const playerState: PlayerState = this.state.players.get(client.sessionId);
    // 클라이언트의 상태를 삭제.
    this.state.players.delete(client.sessionId);
  }

  // 방이 삭제될 때 호출되는 메서드
  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

  private registerHandlers() {
    // 클라이언트로부터 PlayerInput 메시지를 받았을 때, onPlayerInput 메서드를 실행.
    this.onMessage("PlayerInput", this.onPlayerInput.bind(this));
    // 클라이언트로부터 PlayerColorChange 메시지를 받았을 때, onPlayerColorChange 메서드를 실행.
    this.onMessage("PlayerColorChange", this.onPlayerColorChange.bind(this));
    // 클라이언트로부터 PlayerAttack 메시지를 받았을 때, onPlayerAttack 메서드를 실행.
    this.onMessage("PlayerAttack", this.onPlayerAttack.bind(this));
  }

  // 클라이언트로부터 받은 PlayerInput 메시지를 처리하는 메서드
  private onPlayerInput(client: Client, playerInput: PlayerInputMessage) {
    const playerState: PlayerState = this.state.players.get(client.sessionId);

    if (playerState) {
      // 클라이언트로부터 받은 플레이어 입력을 처리.
      playerState.setPosition(playerInput.position, playerInput.timestamp);
      playerState.setDirection(playerInput.direction);
    }
  }
  // 클라이언트로부터 받은 색상 변경 메시지를 처리하는 메서드
  private onPlayerColorChange(client: Client, color: string) {
    const playerState: PlayerState = this.state.players.get(client.sessionId);
    playerState.color = color;
  }
  // 클라이언트로부터 받은 공격 메시지를 처리하는 메서드
  private onPlayerAttack(client: Client, attack: boolean) {
    const playerState: PlayerState = this.state.players.get(client.sessionId);
    if (playerState && playerState.isSeeker) {
      // 공격 로직
    }
    return;
  }
}
