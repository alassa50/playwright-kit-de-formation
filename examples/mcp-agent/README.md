# Exemple MCP Agent — Pipeline QA de bout en bout

## Description

Ce module illustre l'architecture complète d'un pipeline QA autonome basé sur MCP
(Model Context Protocol). Les fichiers ici sont **à usage pédagogique** : ils montrent
la structure et les conventions, pas un agent fonctionnel prêt à l'emploi.

Pour un agent fonctionnel, il faut :

- Une clé API Claude (`ANTHROPIC_API_KEY`)
- Un accès Jira avec token (`JIRA_TOKEN`, `JIRA_BASE_URL`)
- Un token GitHub (`GITHUB_TOKEN`)
- Un environnement staging accessible

## Fichiers

| Fichier           | Rôle                                                   |
| ----------------- | ------------------------------------------------------ |
| `agents.md`       | Exemple complet de contrat agent (à copier et adapter) |
| `mcp-config.json` | Configuration multi-MCP (Playwright + Jira + GitHub)   |
| `orchestrator.ts` | Mini-orchestrateur illustrant le flux complet          |

## Architecture illustrée

```
[Webhook Jira : ticket avec label "needs-e2e" assigné au bot]
        │
        ▼
orchestrator.ts → runQaAgent(ticketId)
        │
        ├─ Jira MCP  ─── lire ticket, poster commentaire, transition statut
        ├─ Claude API ── normaliser ticket + générer le spec
        ├─ Playwright MCP ── inspecter DOM, exécuter test, auto-debug
        └─ GitHub MCP ── créer branche, committer, ouvrir PR
        │
        ▼
[Test commité → PR ouverte → Jira "En revue"]
```

## Démarrage (pipeline réel)

```bash
# 1. Installer les dépendances MCP
npm install @anthropic-ai/sdk @playwright/mcp @modelcontextprotocol/server-github

# 2. Configurer les variables d'environnement
export ANTHROPIC_API_KEY="sk-ant-..."
export GITHUB_TOKEN="ghp_..."
export JIRA_TOKEN="..."
export JIRA_BASE_URL="https://yourcompany.atlassian.net"

# 3. Lancer l'orchestrateur sur un ticket
npx ts-node examples/mcp-agent/orchestrator.ts PROJ-123
```

## Références

- `course/chapter-16.md` — Cours complet sur MCP et agents QA
- `exercises/advanced-05/` — Exercice pratique (normalisation + boucle retry)
- `solutions/advanced-05/` — Solution commentée
- Article de référence : _MCP + Playwright + Jira: How I Automated My Entire QA Workflow End-to-End_ (Mykola Nesvitii, 2026)
