import Phaser from "phaser";
import { BaseScene } from "./baseScene";

export default class OptionsScene extends BaseScene {
  constructor() {
    super("OptionsScene");
  }

  create(data: any) {
    super.create(data);
    this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Options", {
        fontFamily: "Arial",
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5);
  }
}
