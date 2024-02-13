import { Room, Client } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
import { PlayerState } from "./schema/PlayerState";
import { PlayerInputMessage } from "../models/PlayerInputMessage";
import { GameConfig } from "../models/gameConfig";
import gameConfig from "../gameConfig";
import { GameState } from "./schema/MyGameState";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  _config: GameConfig;

  // 방이 생성될 때 호출되는 메서드
  onCreate(options: any) {
    try {
      // 방의 상태를 MyRoomState로 설정.
      this.setState(new MyRoomState(this, this._config));
      this._config = new GameConfig(gameConfig);
      this._config._data.seekerCount = options.seekerCount;
      this._config._data.maxPlayers = options.maxPlayers;
      this.maxClients = options.maxPlayers;
      console.log(options);
      console.log("MyRoom created!", this.roomId, this._config);
      // 게임 상태를 업데이트하는 로직을 실행하기 위해 핸들러를 등록.
      this.registerHandlers();

      // 패치율은 클라이언트에게 게임 상태를 전송하는 속도로, 이 속도에 따라 클라이언트가 게임 상태를 업데이트.
      this.setPatchRate(16);

      // 시뮬레이션 간격은 게임의 로직을 실행하는 간격으로, 이 간격에 따라 게임의 로직이 실행.
      this.setSimulationInterval((dt) => {
        this.state.update(dt / 1000);
      });
    } catch (e) {
      console.error(e);
    }
  }

  // 클라이언트가 방에 참가했을 때 호출되는 메서드
  onJoin(client: Client, options: any) {
    // 클라이언트가 방에 참가했을 때, 로그를 출력.
    console.log(client.sessionId, " ", options.nickname, "joined!");

    const assignData = {
      id: client.sessionId,
      nickname: options.nickname || "Player" + client.sessionId,
      color: options.color || "White",
      isHost: false,
    };
    // 만약 플레이어 수가 0명이라면, 첫번째 플레이어를 방장으로 설정
    if (this.state.players.size === 0) {
      assignData.isHost = true;
      client.send("host", true);
    } else {
      client.send("host", false);
    }

    // 클라이언트의 상태를 PlayerState로 설정.
    const player = new PlayerState(client).assign(assignData);
    // 클라이언트의 상태를 저장.
    // 클라이언트에게 게임 설정을 전송.
    client.send("config", this._config._data);
    client.send("roomId", this.roomId);
    client.send("sessionId", client.sessionId);
    this.state.players.set(client.sessionId, player);
  }

  // 클라이언트가 방을 떠났을 때 호출되는 메서드
  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    // 클라이언트가 방을 떠났을 때, 클라이언트의 상태를 삭제.
    const playerState: PlayerState = this.state.players.get(client.sessionId);
    if (playerState) {
      playerState.disconnect();
    }
    if (playerState.isHost) {
      // 방장이 방을 떠났을 때, 다음 플레이어를 방장으로 설정. (실험해봐야함 여기)
      const nextHost: PlayerState = this.state.players.values().next().value;
      if (nextHost) {
        nextHost.isHost = true;
      }
      this.broadcastNewHost();
    }
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
    // 클라이언트로부터 PlayerReady 메시지를 받았을 때, onPlayerReady 메서드를 실행.
    this.onMessage("PlayerReady", this.onPlayerReady.bind(this));
    // 클라이언트로부터 HostPlayerStartGame 메시지를 받았을 때, onHostPlayerStartGame 메서드를 실행.
    this.onMessage(
      "HostPlayerStartGame",
      this.onHostPlayerStartGame.bind(this)
    );
    // 클라이언트로부터 PlayerAttack 메시지를 받았을 때, onPlayerAttack 메서드를 실행.
    this.onMessage("PlayerAttack", this.onPlayerAttack.bind(this));
  }

  // 클라이언트로부터 받은 PlayerInput 메시지를 처리하는 메서드
  private onPlayerInput(client: Client, playerInput: PlayerInputMessage) {
    const playerState: PlayerState = this.state.players.get(client.sessionId);

    if (playerState) {
      // 클라이언트로부터 받은 플레이어 입력을 처리.
      playerState.setPosition(playerInput);
      console.log(playerInput);
    }
  }
  // 클라이언트로부터 받은 색상 변경 메시지를 처리하는 메서드
  private onPlayerColorChange(client: Client, color: string) {
    const playerState: PlayerState = this.state.players.get(client.sessionId);
    if (!playerState) return;
    playerState.color = color;
  }

  // 클라이언트로부터 받은 준비 메시지를 처리하는 메서드
  private onPlayerReady(client: Client, isReady: boolean) {
    const playerState: PlayerState = this.state.players.get(client.sessionId);
    if (!playerState) return;
    playerState.isReady = isReady;
  }
  // 클라이언트로부터 받은 게임 시작 메시지를 처리하는 메서드
  private onHostPlayerStartGame(client: Client) {
    const playerState: PlayerState = this.state.players.get(client.sessionId);
    // 게임시작 요청을 보낸 유저가 방장이고, 게임이 시작되지 않았다면, 게임 시작 카운트다운 상태로 변경
    const allReady: boolean = this.state.gameState.waitForStart();
    if (
      playerState &&
      playerState.isHost &&
      this.state.gameState.currentState === GameState.WAIT_FOR_START &&
      allReady
    ) {
      this.state.gameState.moveToNextState(GameState.CLOSE_COUNTDOWN);
    }
  }

  // 클라이언트로부터 받은 공격 메시지를 처리하는 메서드
  private onPlayerAttack(client: Client, hiderId: string) {
    const playerState: PlayerState = this.state.players.get(client.sessionId);
    if (playerState && playerState.isSeeker) {
      // 공격 로직
      this.state.seekerAttackHider(client.sessionId, hiderId);
    }
  }

  public broadcastNewHost() {
    this.state.players.forEach((player: PlayerState) => {
      if (player.isHost) {
        this.broadcast("newHost", player.id);
      }
    });
  }
}
