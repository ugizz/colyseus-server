// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.26
// 

using Colyseus.Schema;
using Action = System.Action;

public partial class MyRoomState : Schema {
	[Type(0, "map", typeof(MapSchema<PlayerState>))]
	public MapSchema<PlayerState> players = new MapSchema<PlayerState>();

	[Type(1, "ref", typeof(MyGameState))]
	public MyGameState gameState = new MyGameState();

	/*
	 * Support for individual property change callbacks below...
	 */

	protected event PropertyChangeHandler<MapSchema<PlayerState>> __playersChange;
	public Action OnPlayersChange(PropertyChangeHandler<MapSchema<PlayerState>> __handler, bool __immediate = true) {
		if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
		__callbacks.AddPropertyCallback(nameof(this.players));
		__playersChange += __handler;
		if (__immediate && this.players != null) { __handler(this.players, null); }
		return () => {
			__callbacks.RemovePropertyCallback(nameof(players));
			__playersChange -= __handler;
		};
	}

	protected event PropertyChangeHandler<MyGameState> __gameStateChange;
	public Action OnGameStateChange(PropertyChangeHandler<MyGameState> __handler, bool __immediate = true) {
		if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
		__callbacks.AddPropertyCallback(nameof(this.gameState));
		__gameStateChange += __handler;
		if (__immediate && this.gameState != null) { __handler(this.gameState, null); }
		return () => {
			__callbacks.RemovePropertyCallback(nameof(gameState));
			__gameStateChange -= __handler;
		};
	}

	protected override void TriggerFieldChange(DataChange change) {
		switch (change.Field) {
			case nameof(players): __playersChange?.Invoke((MapSchema<PlayerState>) change.Value, (MapSchema<PlayerState>) change.PreviousValue); break;
			case nameof(gameState): __gameStateChange?.Invoke((MyGameState) change.Value, (MyGameState) change.PreviousValue); break;
			default: break;
		}
	}
}

