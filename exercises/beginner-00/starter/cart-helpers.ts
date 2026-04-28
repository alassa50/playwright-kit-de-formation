/**
 * Interface décrivant un produit du catalogue.
 * Le typage strict évite les fautes de frappe sur les noms de champs
 * et améliore l'autocomplétion dans l'éditeur.
 */
export interface Produit {
  id: number;
  nom: string;
  prix: number;
  enStock: boolean;
}

/**
 * Calcule la somme des prix des produits en stock.
 *
 * Concepts illustrés :
 *  - Fonction fléchée avec types explicites
 *  - Chaînage filter + reduce sur un tableau
 */
export const calculerTotal = (items: Produit[]): number =>
  items.filter((p) => p.enStock).reduce((acc, p) => acc + p.prix, 0);

/**
 * Retourne une ligne formatée pour un produit.
 *
 * Concepts illustrés :
 *  - Template literal (backticks + ${})
 *  - Destructuring d'objet dans les paramètres
 *  - Opérateur ternaire
 */
export function formaterLigne({ nom, prix, enStock }: Produit): string {
  return `${nom} — ${prix.toFixed(2)} €  (${enStock ? 'en stock' : 'épuisé'})`;
}
