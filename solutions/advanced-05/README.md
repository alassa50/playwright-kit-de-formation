# Solution — Avancé 05

## Choix de conception

### normalizeTicket()

- Implémentation **locale sans API Claude** : le parsing est fait en TypeScript pur
  avec des heuristiques simples (regex + détection de patterns Gherkin/bullet).
- Dans un vrai pipeline, cette fonction appelle l'API Claude avec un system prompt
  strict et `JSON.parse()` sur la sortie — voir `course/chapter-16.md` section 5.
- **Validation d'entrée à la frontière** : lever une erreur explicite sur description
  vide évite des comportements silencieux en aval.
- `async` même sans `await` : signature cohérente avec la version API (facilite la
  substitution sans changer les appelants).

### runWithAutoDebug()

- **Observation avant correction** : `navigate → screenshot → get_dom` AVANT
  `generate_fix`. C'est le principe central du chapitre 16 — corriger depuis des
  preuves, pas des inférences.
- **Plafonnement strict à `MAX_ATTEMPTS`** : évite les boucles infinies sur un bug
  irréductible. En production, après 3 échecs l'agent poste un commentaire Jira et
  cède la main à un humain.
- **Dependency injection** des outils MCP : permet les tests locaux sans connexion
  réelle. Le même code tourne en prod avec les vrais clients MCP injectés.

### AGENTS.md

- Règles prescriptives (UNIQUEMENT, INTERDIT, JAMAIS) plutôt que descriptives
  ("de préférence", "essayer de") — voir la section 3 du chapitre 16.
- Versionné dans le dépôt : mis à jour quand l'agent viole une règle, pas en
  modifiant le prompt à la main.
