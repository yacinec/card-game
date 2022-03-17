import { Card } from './Card';
import { Player } from './Player';

export class PlayerController {
  private player: Player;

  constructor(player: Player) {
    this.player = player;
  }

  createCards() {
    var cards = new Array<Card>();

    var j = 0;
    for (var i = 0; i < 10; i++) {
      var value: number;

      do {
        value = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
      } while (cards.find((c) => c.getValue() === value) && j < 100);

      const newCard = new Card(value);
      cards.push(newCard);
    }

    this.player.setCards(cards);
  }

  getPlayer(): Player {
    return this.player;
  }

  getScore() {
    let result = 0;
    this.player.getCards().forEach((c) => {
      if (!c.getBackward()) {
        result += c.getValue() + 1;
      }
    });
    return result;
  }
}
