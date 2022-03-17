import { Card } from './Card';

export class Player {
  private cards: Array<Card>;

  constructor() {
    this.cards = new Array<Card>();
  }

  setCards(cards: Array<Card>) {
    this.cards = cards;
  }

  getCards() {
    return this.cards;
  }
}
