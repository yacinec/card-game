import * as PIXI from 'pixi.js';

export class Card {
  private value: number;
  private position: PIXI.Point;
  private sprite: PIXI.Sprite;
  private width: number;
  private height: number;
  private backward: boolean;

  constructor(value: number) {
    this.value = value;
    this.width = 27;
    this.height = 35;
    this.position = new PIXI.Point(this.width * this.value, 0);
    this.backward = true;

    if (this.backward) {
      this.sprite = PIXI.Sprite.from('images/cards_backward.png');
    } else {
      var baseTexture = new PIXI.BaseTexture('./images/cards.png');
      var texture = new PIXI.Texture(
        baseTexture,
        new PIXI.Rectangle(
          this.position.x,
          this.position.y,
          this.width,
          this.height
        )
      );
      this.sprite = PIXI.Sprite.from(texture);
    }
  }

  getValue() {
    return this.value;
  }

  setValue(newValue: number) {
    if (newValue > 0 && newValue < 14) this.value = newValue;
  }

  getSprite() {
    return this.sprite;
  }

  getBackward() {
    return this.backward;
  }

  /**
   * Return the card face down and update its sprite
   */
  returnCard() {
    this.backward = false;

    var baseTexture = new PIXI.BaseTexture('./images/cards.png');

    var texture = new PIXI.Texture(
      baseTexture,
      new PIXI.Rectangle(
        this.position.x,
        this.position.y,
        this.width,
        this.height
      )
    );

    this.sprite = PIXI.Sprite.from(texture);
  }
}
