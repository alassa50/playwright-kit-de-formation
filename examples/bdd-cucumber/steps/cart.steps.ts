import { Given, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';

type CartWorld = {
  total: number;
};

const world: CartWorld = { total: 0 };

Given('un panier vide', () => {
  world.total = 0;
});

When("j'ajoute un produit à {int} euros", (price: number) => {
  world.total += price;
});

Then('le total du panier doit être {int} euros', (expectedTotal: number) => {
  assert.equal(world.total, expectedTotal);
});
