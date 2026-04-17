Feature: Panier e-commerce
  Scenario: Ajouter un produit met à jour le total
    Given un panier vide
    When j'ajoute un produit à 25 euros
    Then le total du panier doit être 25 euros
