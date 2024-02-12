// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.26
// 

using Colyseus.Schema;
using Action = System.Action;

public partial class MyGameState : Schema {
	[Type(0, "string")]
	public string currentState = default(string);

	[Type(1, "boolean")]
	public bool seekerWon = default(bool);

	[Type(2, "int32")]
	public int countdown = default(int);

	/*
	 * Support for individual property change callbacks below...
	 */

	protected event PropertyChangeHandler<string> __currentStateChange;
	public Action OnCurrentStateChange(PropertyChangeHandler<string> __handler, bool __immediate = true) {
		if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
		__callbacks.AddPropertyCallback(nameof(this.currentState));
		__currentStateChange += __handler;
		if (__immediate && this.currentState != default(string)) { __handler(this.currentState, default(string)); }
		return () => {
			__callbacks.RemovePropertyCallback(nameof(currentState));
			__currentStateChange -= __handler;
		};
	}

	protected event PropertyChangeHandler<bool> __seekerWonChange;
	public Action OnSeekerWonChange(PropertyChangeHandler<bool> __handler, bool __immediate = true) {
		if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
		__callbacks.AddPropertyCallback(nameof(this.seekerWon));
		__seekerWonChange += __handler;
		if (__immediate && this.seekerWon != default(bool)) { __handler(this.seekerWon, default(bool)); }
		return () => {
			__callbacks.RemovePropertyCallback(nameof(seekerWon));
			__seekerWonChange -= __handler;
		};
	}

	protected event PropertyChangeHandler<int> __countdownChange;
	public Action OnCountdownChange(PropertyChangeHandler<int> __handler, bool __immediate = true) {
		if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
		__callbacks.AddPropertyCallback(nameof(this.countdown));
		__countdownChange += __handler;
		if (__immediate && this.countdown != default(int)) { __handler(this.countdown, default(int)); }
		return () => {
			__callbacks.RemovePropertyCallback(nameof(countdown));
			__countdownChange -= __handler;
		};
	}

	protected override void TriggerFieldChange(DataChange change) {
		switch (change.Field) {
			case nameof(currentState): __currentStateChange?.Invoke((string) change.Value, (string) change.PreviousValue); break;
			case nameof(seekerWon): __seekerWonChange?.Invoke((bool) change.Value, (bool) change.PreviousValue); break;
			case nameof(countdown): __countdownChange?.Invoke((int) change.Value, (int) change.PreviousValue); break;
			default: break;
		}
	}
}

