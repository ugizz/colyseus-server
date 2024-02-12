import { Schema, type } from "@colyseus/schema";
export class Vect3 extends Schema {
  @type("float32")
  x: number = 0;

  @type("float32")
  y: number = 0;

  @type("float32")
  z: number = 0;
}

export class Quat extends Schema {
  @type("float32")
  x: number = 0;

  @type("float32")
  y: number = 0;

  @type("float32")
  z: number = 0;
}

export class EntityData extends Schema {
  @type(Vect3)
  position = new Vect3();

  @type(Quat)
  rotation = new Quat();
}
