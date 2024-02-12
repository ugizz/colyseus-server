// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.26
// 

using Colyseus.Schema;
using Action = System.Action;

public partial class PlayerState : Schema {
	[Type(0, "string")]
	public string id = default(string);

	[Type(1, "string")]
	public string nickname = default(string);

	[Type(2, "string")]
	public string color = default(string);

	[Type(3, "boolean")]
	public bool isHost = default(bool);

	[Type(4, "boolean")]
	public bool isReady = default(bool);

	[Type(5, "boolean")]
	public bool isSeeker = default(bool);

	[Type(6, "boolean")]
	public bool canMove = default(bool);

	[Type(7, "boolean")]
	public bool isCaptured = default(bool);

	[Type(8, "float32")]
	public float spawnPoint = default(float);

	[Type(9, "float32")]
	public float xPos = default(float);

	[Type(10, "float32")]
	public float yPos = default(float);

	[Type(11, "float32")]
	public float zPos = default(float);

	[Type(12, "float32")]
	public float positionTimestamp = default(float);

	[Type(13, "float32")]
	public float xDir = default(float);

	[Type(14, "float32")]
	public float yDir = default(float);

	[Type(15, "float32")]
	public float zDir = default(float);

	/*
	 * Support for individual property change callbacks below...
	 */

	protected event PropertyChangeHandler<string> __idChange;
	public Action OnIdChange(PropertyChangeHandler<string> __handler, bool __immediate = true) {
		if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
		__callbacks.AddPropertyCallback(nameof(this.id));
		__idChange += __handler;
		if (__immediate && this.id != default(string)) { __handler(this.id, default(string)); }
		return () => {
			__callbacks.RemovePropertyCallback(nameof(id));
			__idChange -= __handler;
		};
	}

	protected event PropertyChangeHandler<string> __nicknameChange;
	public Action OnNicknameChange(PropertyChangeHandler<string> __handler, bool __immediate = true) {
		if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
		__callbacks.AddPropertyCallback(nameof(this.nickname));
		__nicknameChange += __handler;
		if (__immediate && this.nickname != default(string)) { __handler(this.nickname, default(string)); }
		return () => {
			__callbacks.RemovePropertyCallback(nameof(nickname));
			__nicknameChange -= __handler;
		};
	}

	protected event PropertyChangeHandler<string> __colorChange;
	public Action OnColorChange(PropertyChangeHandler<string> __handler, bool __immediate = true) {
		if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
		__callbacks.AddPropertyCallback(nameof(this.color));
		__colorChange += __handler;
		if (__immediate && this.color != default(string)) { __handler(this.color, default(string)); }
		return () => {
			__callbacks.RemovePropertyCallback(nameof(color));
			__colorChange -= __handler;
		};
	}

	protected event PropertyChangeHandler<bool> __isHostChange;
	public Action OnIsHostChange(PropertyChangeHandler<bool> __handler, bool __immediate = true) {
		if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
		__callbacks.AddPropertyCallback(nameof(this.isHost));
		__isHostChange += __handler;
		if (__immediate && this.isHost != default(bool)) { __handler(this.isHost, default(bool)); }
		return () => {
			__callbacks.RemovePropertyCallback(nameof(isHost));
			__isHostChange -= __handler;
		};
	}

	protected event PropertyChangeHandler<bool> __isReadyChange;
	public Action OnIsReadyChange(PropertyChangeHandler<bool> __handler, bool __immediate = true) {
		if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
		__callbacks.AddPropertyCallback(nameof(this.isReady));
		__isReadyChange += __handler;
		if (__immediate && this.isReady != default(bool)) { __handler(this.isReady, default(bool)); }
		return () => {
			__callbacks.RemovePropertyCallback(nameof(isReady));
			__isReadyChange -= __handler;
		};
	}

	protected event PropertyChangeHandler<bool> __isSeekerChange;
	public Action OnIsSeekerChange(PropertyChangeHandler<bool> __handler, bool __immediate = true) {
		if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
		__callbacks.AddPropertyCallback(nameof(this.isSeeker));
		__isSeekerChange += __handler;
		if (__immediate && this.isSeeker != default(bool)) { __handler(this.isSeeker, default(bool)); }
		return () => {
			__callbacks.RemovePropertyCallback(nameof(isSeeker));
			__isSeekerChange -= __handler;
		};
	}

	protected event PropertyChangeHandler<bool> __canMoveChange;
	public Action OnCanMoveChange(PropertyChangeHandler<bool> __handler, bool __immediate = true) {
		if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
		__callbacks.AddPropertyCallback(nameof(this.canMove));
		__canMoveChange += __handler;
		if (__immediate && this.canMove != default(bool)) { __handler(this.canMove, default(bool)); }
		return () => {
			__callbacks.RemovePropertyCallback(nameof(canMove));
			__canMoveChange -= __handler;
		};
	}

	protected event PropertyChangeHandler<bool> __isCapturedChange;
	public Action OnIsCapturedChange(PropertyChangeHandler<bool> __handler, bool __immediate = true) {
		if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
		__callbacks.AddPropertyCallback(nameof(this.isCaptured));
		__isCapturedChange += __handler;
		if (__immediate && this.isCaptured != default(bool)) { __handler(this.isCaptured, default(bool)); }
		return () => {
			__callbacks.RemovePropertyCallback(nameof(isCaptured));
			__isCapturedChange -= __handler;
		};
	}

	protected event PropertyChangeHandler<float> __spawnPointChange;
	public Action OnSpawnPointChange(PropertyChangeHandler<float> __handler, bool __immediate = true) {
		if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
		__callbacks.AddPropertyCallback(nameof(this.spawnPoint));
		__spawnPointChange += __handler;
		if (__immediate && this.spawnPoint != default(float)) { __handler(this.spawnPoint, default(float)); }
		return () => {
			__callbacks.RemovePropertyCallback(nameof(spawnPoint));
			__spawnPointChange -= __handler;
		};
	}

	protected event PropertyChangeHandler<float> __xPosChange;
	public Action OnXPosChange(PropertyChangeHandler<float> __handler, bool __immediate = true) {
		if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
		__callbacks.AddPropertyCallback(nameof(this.xPos));
		__xPosChange += __handler;
		if (__immediate && this.xPos != default(float)) { __handler(this.xPos, default(float)); }
		return () => {
			__callbacks.RemovePropertyCallback(nameof(xPos));
			__xPosChange -= __handler;
		};
	}

	protected event PropertyChangeHandler<float> __yPosChange;
	public Action OnYPosChange(PropertyChangeHandler<float> __handler, bool __immediate = true) {
		if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
		__callbacks.AddPropertyCallback(nameof(this.yPos));
		__yPosChange += __handler;
		if (__immediate && this.yPos != default(float)) { __handler(this.yPos, default(float)); }
		return () => {
			__callbacks.RemovePropertyCallback(nameof(yPos));
			__yPosChange -= __handler;
		};
	}

	protected event PropertyChangeHandler<float> __zPosChange;
	public Action OnZPosChange(PropertyChangeHandler<float> __handler, bool __immediate = true) {
		if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
		__callbacks.AddPropertyCallback(nameof(this.zPos));
		__zPosChange += __handler;
		if (__immediate && this.zPos != default(float)) { __handler(this.zPos, default(float)); }
		return () => {
			__callbacks.RemovePropertyCallback(nameof(zPos));
			__zPosChange -= __handler;
		};
	}

	protected event PropertyChangeHandler<float> __positionTimestampChange;
	public Action OnPositionTimestampChange(PropertyChangeHandler<float> __handler, bool __immediate = true) {
		if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
		__callbacks.AddPropertyCallback(nameof(this.positionTimestamp));
		__positionTimestampChange += __handler;
		if (__immediate && this.positionTimestamp != default(float)) { __handler(this.positionTimestamp, default(float)); }
		return () => {
			__callbacks.RemovePropertyCallback(nameof(positionTimestamp));
			__positionTimestampChange -= __handler;
		};
	}

	protected event PropertyChangeHandler<float> __xDirChange;
	public Action OnXDirChange(PropertyChangeHandler<float> __handler, bool __immediate = true) {
		if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
		__callbacks.AddPropertyCallback(nameof(this.xDir));
		__xDirChange += __handler;
		if (__immediate && this.xDir != default(float)) { __handler(this.xDir, default(float)); }
		return () => {
			__callbacks.RemovePropertyCallback(nameof(xDir));
			__xDirChange -= __handler;
		};
	}

	protected event PropertyChangeHandler<float> __yDirChange;
	public Action OnYDirChange(PropertyChangeHandler<float> __handler, bool __immediate = true) {
		if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
		__callbacks.AddPropertyCallback(nameof(this.yDir));
		__yDirChange += __handler;
		if (__immediate && this.yDir != default(float)) { __handler(this.yDir, default(float)); }
		return () => {
			__callbacks.RemovePropertyCallback(nameof(yDir));
			__yDirChange -= __handler;
		};
	}

	protected event PropertyChangeHandler<float> __zDirChange;
	public Action OnZDirChange(PropertyChangeHandler<float> __handler, bool __immediate = true) {
		if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
		__callbacks.AddPropertyCallback(nameof(this.zDir));
		__zDirChange += __handler;
		if (__immediate && this.zDir != default(float)) { __handler(this.zDir, default(float)); }
		return () => {
			__callbacks.RemovePropertyCallback(nameof(zDir));
			__zDirChange -= __handler;
		};
	}

	protected override void TriggerFieldChange(DataChange change) {
		switch (change.Field) {
			case nameof(id): __idChange?.Invoke((string) change.Value, (string) change.PreviousValue); break;
			case nameof(nickname): __nicknameChange?.Invoke((string) change.Value, (string) change.PreviousValue); break;
			case nameof(color): __colorChange?.Invoke((string) change.Value, (string) change.PreviousValue); break;
			case nameof(isHost): __isHostChange?.Invoke((bool) change.Value, (bool) change.PreviousValue); break;
			case nameof(isReady): __isReadyChange?.Invoke((bool) change.Value, (bool) change.PreviousValue); break;
			case nameof(isSeeker): __isSeekerChange?.Invoke((bool) change.Value, (bool) change.PreviousValue); break;
			case nameof(canMove): __canMoveChange?.Invoke((bool) change.Value, (bool) change.PreviousValue); break;
			case nameof(isCaptured): __isCapturedChange?.Invoke((bool) change.Value, (bool) change.PreviousValue); break;
			case nameof(spawnPoint): __spawnPointChange?.Invoke((float) change.Value, (float) change.PreviousValue); break;
			case nameof(xPos): __xPosChange?.Invoke((float) change.Value, (float) change.PreviousValue); break;
			case nameof(yPos): __yPosChange?.Invoke((float) change.Value, (float) change.PreviousValue); break;
			case nameof(zPos): __zPosChange?.Invoke((float) change.Value, (float) change.PreviousValue); break;
			case nameof(positionTimestamp): __positionTimestampChange?.Invoke((float) change.Value, (float) change.PreviousValue); break;
			case nameof(xDir): __xDirChange?.Invoke((float) change.Value, (float) change.PreviousValue); break;
			case nameof(yDir): __yDirChange?.Invoke((float) change.Value, (float) change.PreviousValue); break;
			case nameof(zDir): __zDirChange?.Invoke((float) change.Value, (float) change.PreviousValue); break;
			default: break;
		}
	}
}

