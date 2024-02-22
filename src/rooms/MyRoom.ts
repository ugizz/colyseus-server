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
      this._config = new GameConfig(gameConfig);
      this._config._data.seekerCount = options.seekerCount || 1;
      this._config._data.maxPlayers = options.maxPlayers || 8;
      this.maxClients = this._config.MaxPlayers;
      this.setState(new MyRoomState(this, this._config));
      console.log(options);
      console.log("MyRoom created!", this.roomId, this._config);
      // 게임 상태를 업데이트하는 로직을 실행하기 위해 핸들러를 등록.
      this.registerHandlers();

      // 패치율은 클라이언트에게 게임 상태(State)를 전송하는 속도로, 이 속도에 따라 클라이언트가 게임 상태를 업데이트.
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
      accessToken: options.accessToken || "",
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
    console.log("access token", player.AccessToken);
    // 클라이언트의 상태를 저장.
    // 클라이언트에게 게임 설정을 전송.
    client.send("config", this._config._data);
    // 클라이언트에게 방 ID를 전송.
    client.send("roomId", this.roomId);
    // 클라이언트에게 유저 세션 ID를 전송.
    client.send("sessionId", client.sessionId);
    // 방에 참여한 플레이어 목록에 유저 세션 ID를 추가.
    this.state.players.set(client.sessionId, player);
  }

  // 클라이언트가 방을 떠났을 때 호출되는 메서드
  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    // 클라이언트가 방을 떠났을 때, 클라이언트의 상태를 삭제.
    const playerState: PlayerState = this.state.players.get(client.sessionId);
    if (playerState) {
      // 방에 참여한 플레이어 목록에서 유저 세션 ID를 삭제.
      this.state.players.delete(client.sessionId);
      // 클라이언트의 연결을 해제.
      playerState.disconnect();
      // 만약 클라이언트가 술래라면, 술래 수를 감소.
      if (playerState.isSeeker) {
        this.state.gameState.seekerLeft();
      }
    }
    if (playerState.isHost) {
      // 방장이 방을 떠났을 때, 다음 플레이어를 방장으로 설정
      const nextHost: PlayerState = this.state.players.values().next().value;
      if (nextHost) {
        // 방장으로 설정.
        nextHost.isHost = true;
      }
      // 모든 클라이언트에게 새로운 방장을 알림.
      this.broadcastNewHost();
    }
  }

  // 방이 삭제될 때 호출되는 메서드
  onDispose() {
    // 방이 삭제될 때, 로그를 출력.
    console.log("room", this.roomId, "disposing...");
  }
  //  클라이언트로부터 받은 메시지를 처리하는 핸들러를 등록하는 메서드
  private registerHandlers() {
    // 클라이언트로부터 PlayerInput 메시지를 받았을 때, onPlayerInput 메서드를 실행.
    // bind 메서드를 사용하여, onPlayerInput 메서드 내부에서 this 키워드를 사용할 수 있도록 설정.
    this.onMessage("PlayerInput", this.onPlayerInput.bind(this));
    // 클라이언트로부터 PlayerColorChange 메시지를 받았을 때, onPlayerColorChange 메서드를 실행.
    // bind 메서드를 사용하여, onPlayerColorChange 메서드 내부에서 this 키워드를 사용할 수 있도록 설정.
    this.onMessage("PlayerColorChange", this.onPlayerColorChange.bind(this));
    // 클라이언트로부터 PlayerReady 메시지를 받았을 때, onPlayerReady 메서드를 실행.
    // bind 메서드를 사용하여, onPlayerReady 메서드 내부에서 this 키워드를 사용할 수 있도록 설정.
    this.onMessage("PlayerReady", this.onPlayerReady.bind(this));
    // 클라이언트로부터 HostPlayerStartGame 메시지를 받았을 때, onHostPlayerStartGame 메서드를 실행.
    // bind 메서드를 사용하여, onHostPlayerStartGame 메서드 내부에서 this 키워드를 사용할 수 있도록 설정.
    this.onMessage(
      "HostPlayerStartGame",
      this.onHostPlayerStartGame.bind(this)
    );
    // 클라이언트로부터 PlayerAttack 메시지를 받았을 때, onPlayerAttack 메서드를 실행.
    // bind 메서드를 사용하여, onPlayerAttack 메서드 내부에서 this 키워드를 사용할 수 있도록 설정.
    this.onMessage("PlayerAttack", this.onPlayerAttack.bind(this));
  }

  // 클라이언트로부터 받은 PlayerInput 메시지를 처리하는 메서드
  private onPlayerInput(client: Client, playerInput: PlayerInputMessage) {
    // 클라이언트의 상태를 가져옴.
    const playerState: PlayerState = this.state.players.get(client.sessionId);
    // 만약 클라이언트의 상태가 존재한다면, 클라이언트로부터 받은 플레이어 입력을 처리.
    if (playerState) {
      // 클라이언트로부터 받은 플레이어 입력을 처리.
      playerState.setPosition(playerInput);
    }
  }
  // 클라이언트로부터 받은 색상 변경 메시지를 처리하는 메서드
  // 랜덤색상 사용으로 인해 이 메서드는 사용하지 않음
  private onPlayerColorChange(client: Client, color: string) {
    const playerState: PlayerState = this.state.players.get(client.sessionId);
    if (!playerState) return;
    playerState.color = color;
  }

  // 클라이언트로부터 받은 준비 메시지를 처리하는 메서드
  // 레디 기능 삭제로 인해 이 메서드는 사용하지 않음
  private onPlayerReady(client: Client, isReady: boolean) {
    const playerState: PlayerState = this.state.players.get(client.sessionId);
    if (!playerState) return;
    playerState.isReady = isReady;
  }
  // 클라이언트로부터 받은 게임 시작 메시지를 처리하는 메서드
  private onHostPlayerStartGame(client: Client) {
    const playerState: PlayerState = this.state.players.get(client.sessionId);
    // 게임시작 요청을 보낸 유저가 방장이고, 게임이 시작되지 않았다면, 게임 시작 카운트다운 상태로 변경
    // const allReady: boolean = this.state.gameState.waitForStart();
    if (
      playerState &&
      playerState.isHost
      // this.state.gameState.currentState === GameState.WAIT_FOR_START &&
      // allReady
    ) {
      this.state.gameState.moveToNextState(GameState.INITIALIZE);
      // 방에 참여한 유저들에게 게임 시작 메시지를 전송
      // 이 메시지를 받은 유저들은 바로 게임 시작
      this.broadcast("gameStart", true);
      console.log(this.roomId + " Game Started!");
    }
  }

  // 클라이언트로부터 받은 공격 메시지를 처리하는 메서드
  private onPlayerAttack(client: Client, hiderId: string) {
    // 클라이언트의 상태를 가져옴
    const playerState: PlayerState = this.state.players.get(client.sessionId);
    // 만약 클라이언트가 술래라면, 공격 로직을 실행
    if (playerState && playerState.isSeeker) {
      // 공격 로직
      // console.log("Player Attack!", hiderId);
      this.state.seekerAttackHider(client.sessionId, hiderId);
    }
  }

  // 방장이 변경되었을 때, 모든 클라이언트에게 새로운 방장을 알리는 메서드
  public broadcastNewHost() {
    // 방에 참여한 모든 클라이언트에게 새로운 방장을 알림
    this.state.players.forEach((player: PlayerState) => {
      if (player.isHost) {
        this.broadcast("newHost", player.id);
      }
    });
  }
}
