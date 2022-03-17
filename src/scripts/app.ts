import * as PIXI from 'pixi.js';
import { Player } from './Player';
import { PlayerController } from './PlayerController';
import { Card } from './Card';

interface EngineParams {
  containerId: string;
  canvasW: number;
  canvasH: number;
  fpsMax: number;
}

class Engine {
  public container: HTMLElement;
  public loader: PIXI.Loader;
  public renderer: PIXI.Renderer;
  public stage: PIXI.Container;
  public graphics: PIXI.Graphics;
  public fpsMax: number;

  // Resources
  public background: PIXI.Sprite;

  // Game
  public playerController: PlayerController;
  public shuffleButton: PIXI.Sprite;

  constructor(params: EngineParams) {
    this.loader = PIXI.Loader.shared;
    this.renderer = PIXI.autoDetectRenderer({
      width: params.canvasW,
      height: params.canvasH,
      antialias: true,
    });

    this.stage = new PIXI.Container();
    this.graphics = new PIXI.Graphics();
    this.fpsMax = params.fpsMax;

    this.container = params.containerId
      ? document.getElementById(params.containerId) || document.body
      : document.body;
    this.container.appendChild(this.renderer.view);

    this.background = PIXI.Sprite.from('images/table.png');

    this.shuffleButton = PIXI.Sprite.from('images/shuffle.png');
    this.shuffleButton.anchor.set(0.5);
    this.shuffleButton.width = 50;
    this.shuffleButton.height = 50;
    this.shuffleButton.interactive = true;

    this.shuffleButton.on('mousedown', () => {
      this.init();
      create();
    });

    this.playerController = new PlayerController(new Player());
    this.playerController.createCards();
  }

  init() {
    this.stage = new PIXI.Container();
    this.graphics = new PIXI.Graphics();

    this.playerController = new PlayerController(new Player());
    this.playerController.createCards();
  }
}

const engine = new Engine({
  containerId: 'game',
  canvasW: 800,
  canvasH: 450,
  fpsMax: 60,
});

window.onload = load;

function load() {
  create();
}

function create() {
  engine.background.anchor.set(0.5);
  engine.background.x = engine.renderer.width / 2;
  engine.background.y = engine.renderer.height / 2;
  engine.stage.addChild(engine.background);

  engine.playerController
    .getPlayer()
    .getCards()
    .forEach((card: Card, index) => {
      var sprite = card.getSprite();
      sprite.anchor.set(0.5);
      sprite.x = engine.renderer.width / 2 + 50 * index - 225;
      sprite.y = engine.renderer.height / 2;
      sprite.interactive = true;
      sprite.on('mousedown', () => {
        card.returnCard();
        update();
      });

      engine.stage.addChild(sprite);
    });

  render();
}

function update() {
  let nbCardsReturned = 0;
  engine.stage = new PIXI.Container();
  engine.stage.addChild(engine.background);

  engine.playerController
    .getPlayer()
    .getCards()
    .forEach((card: Card) => {
      if (!card.getBackward()) {
        nbCardsReturned++;
      }
    });

  if (nbCardsReturned >= 5) {
    const score = engine.playerController.getScore();
    const scoreLabel = new PIXI.Text('Your score is ' + score, {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xff1010,
      align: 'center',
    });
    scoreLabel.x = engine.renderer.width / 2 - scoreLabel.width / 2;
    scoreLabel.y = engine.renderer.height / 2 - 100;
    engine.stage.addChild(scoreLabel);

    engine.shuffleButton.x = engine.renderer.width / 2;
    engine.shuffleButton.y = engine.renderer.height / 2 + 100;

    engine.playerController
      .getPlayer()
      .getCards()
      .forEach((card: Card, index) => {
        var sprite = card.getSprite();
        sprite.anchor.set(0.5);
        sprite.x = engine.renderer.width / 2 + 50 * index - 225;
        sprite.y = engine.renderer.height / 2;
        sprite.interactive = false;

        engine.stage.addChild(sprite);
      });

    engine.stage.addChild(engine.shuffleButton);
  } else {
    engine.playerController
      .getPlayer()
      .getCards()
      .forEach((card: Card, index) => {
        var sprite = card.getSprite();
        sprite.anchor.set(0.5);
        sprite.x = engine.renderer.width / 2 + 50 * index - 225;
        sprite.y = engine.renderer.height / 2;
        sprite.interactive = true;
        sprite.on('mousedown', () => {
          card.returnCard();
        });

        if (!card.getBackward()) {
          nbCardsReturned++;
        }
        engine.stage.addChild(sprite);
      });
  }

  render();
}

function render() {
  requestAnimationFrame(render);
  engine.renderer.render(engine.stage);
}
