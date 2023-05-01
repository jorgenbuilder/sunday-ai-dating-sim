import Phaser from "phaser";
import TitleScene from "./TitleScene";
import OpeningSequenceScene from "./OpeningSequenceScene";
import OptionsScene from "./OptionsScene";
import SceneManager from "./SceneManager";
import PullingCropsScene from "./PullingCropsScene";
import { BaseScene } from "./baseScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [TitleScene, OpeningSequenceScene, OptionsScene, PullingCropsScene],
  physics: {
    default: "arcade",
    arcade: {},
  },
};

const game = new Phaser.Game(config);

const sceneManager = new SceneManager(game);
(game.scene.keys.TitleScene as BaseScene).sceneManager = sceneManager;
(game.scene.keys.OpeningSequenceScene as BaseScene).sceneManager = sceneManager;
(game.scene.keys.OptionsScene as BaseScene).sceneManager = sceneManager;
(game.scene.keys.PullingCropsScene as BaseScene).sceneManager = sceneManager;
