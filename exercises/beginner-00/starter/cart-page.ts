import type { Produit } from './cart-helpers';

/**
 * Génère le HTML de la page panier à partir d'une liste de produits.
 * Utilise un template literal et la méthode Array.map pour construire
 * dynamiquement chaque ligne du tableau.
 */
export function buildCartHtml(produits: Produit[]): string {
  const lignes = produits
    .map(
      ({ id, nom, prix, enStock }) => `
      <tr data-id="${id}">
        <td>${nom}</td>
        <td class="prix">${prix.toFixed(2)} €</td>
        <td class="stock">${enStock ? 'en stock' : 'épuisé'}</td>
      </tr>`,
    )
    .join('');

  const total = produits.filter((p) => p.enStock).reduce((acc, p) => acc + p.prix, 0);

  return `
    <main>
      <h1>Panier</h1>
      <table>
        <thead>
          <tr><th>Produit</th><th>Prix</th><th>Disponibilité</th></tr>
        </thead>
        <tbody id="liste-produits">
          ${lignes}
        </tbody>
      </table>
      <p role="status" id="total">Total : ${total.toFixed(2)} €</p>
      <p id="nb-articles">Articles en stock : ${produits.filter((p) => p.enStock).length}</p>
    </main>
  `;
}
