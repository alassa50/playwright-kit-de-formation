# Solution — Avancé 06

## Choix de conception

### Fichiers `.agent.md`

- **Prescriptif, pas descriptif** : chaque règle utilise UNIQUEMENT, INTERDIT,
  TOUJOURS, JAMAIS — les formulations vagues ("préférer", "essayer") sont absentes
  intentionnellement. Un LLM suit des contraintes absolues mieux qu'une recommandation
  nuancée. Voir chapitre 17, section 4.
- **Séparation des responsabilités** : le Planner ne produit jamais de code, le Generator
  ne crée pas de plans, le Healer ne modifie pas les assertions métier. Cette séparation
  évite les comportements inattendus quand les agents sont chaînés.
- **Séquence d'observation dans le Healer** : la règle `navigate → screenshot → DOM → fix`
  est explicite dans `playwright-test-healer.agent.md`. C'est le même principe
  qu'en chapitre 16 (section 4) : corriger depuis des preuves, pas depuis les inférences.

### `healSpec()`

- **Deux règles codées explicitement** : violation strict mode et sélecteur CSS. Le
  fait de les coder (plutôt que de les déléguer à un LLM) force la compréhension de
  ce que le Healer fait réellement — c'est l'objectif pédagogique de l'exercice.
- **DOM snapshot comme source de vérité** : la correction est dérivée de ce que
  contient `domSnapshot`, pas de la supposition. Si le DOM contient `<button>`,
  on génère `getByRole('button')`. Si `data-testid` est présent, on l'utilise en priorité.
- **Cas inconnu → `fixed: false` avec diagnostic** : retourner `false` sans modifier
  le spec est plus sûr que d'appliquer une correction approximative. Le diagnostic
  oriente l'humain sans bloquer le pipeline.
- **`diagnosis` toujours renseigné** : même pour les cas inconnus, la propriété
  indique la cause probable et la prochaine action recommandée.

### Relation avec le chapitre 16

Les agents natifs (chapitre 17) et le pipeline MCP (chapitre 16) ne sont pas
concurrents. Les agents natifs sont l'entrée accessible ; le pipeline MCP est
l'industrialisation. Les mêmes principes s'appliquent aux deux :

- Règles prescriptives dans les fichiers de définition
- Observation avant correction
- Plafonnement des tentatives
- Revue humaine obligatoire avant merge
