# Graph Report - .  (2026-06-06)

## Corpus Check
- Corpus is ~11,021 words - fits in a single context window. You may not need a graph.

## Summary
- 42 nodes · 55 edges · 6 communities (5 shown, 1 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Plugin Manifest & Metadata|Plugin Manifest & Metadata]]
- [[_COMMUNITY_Doc Standards & Style Rules|Doc Standards & Style Rules]]
- [[_COMMUNITY_Skill Core & Routing|Skill Core & Routing]]
- [[_COMMUNITY_Toolchain & Deployment|Toolchain & Deployment]]
- [[_COMMUNITY_Badge Registries|Badge Registries]]
- [[_COMMUNITY_Eval Set|Eval Set]]

## God Nodes (most connected - your core abstractions)
1. `Languages index (routing)` - 9 edges
2. `Documentation writing standards (language-agnostic)` - 7 edges
3. `ezai-docs-writer SKILL` - 6 edges
4. `References root router` - 6 edges
5. `Diátaxis quadrants and page templates` - 5 edges
6. `Python documentation standards (Google-style + MkDocs)` - 5 edges
7. `JavaScript/TypeScript documentation standards (JSDoc/TSDoc + VitePress)` - 5 edges
8. `Badge pair pattern (forge + language registries)` - 5 edges
9. `README reference standards` - 4 edges
10. `author` - 3 edges

## Surprising Connections (you probably didn't know these)
- `ezai-docs-writer SKILL` --implements--> `ezai-docs-writer plugin`  [EXTRACTED]
  plugins/ezai-docs-writer/SKILL.md → plugins/ezai-docs-writer/.claude-plugin/plugin.json
- `eval set docs-writer` --references--> `ezai-docs-writer SKILL`  [EXTRACTED]
  plugins/ezai-docs-writer/evals/eval_set_docs_writer.json → plugins/ezai-docs-writer/SKILL.md
- `Python documentation standards (Google-style + MkDocs)` --references--> `Diátaxis quadrants and page templates`  [INFERRED]
  plugins/ezai-docs-writer/references/languages/python/standards.md → plugins/ezai-docs-writer/references/common/quadrants-templates.md
- `Languages index (routing)` --references--> `Badge registry — JavaScript/TypeScript`  [EXTRACTED]
  plugins/ezai-docs-writer/references/languages/index.md → plugins/ezai-docs-writer/references/languages/javascript/badge-registry.md
- `Languages index (routing)` --references--> `Badge registry — Python`  [EXTRACTED]
  plugins/ezai-docs-writer/references/languages/index.md → plugins/ezai-docs-writer/references/languages/python/badge-registry.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Badge block generation requires forge registry + language registry pair** — concept_badge_pair_pattern, forge_github_badge_registry, python_badge_registry, javascript_badge_registry, forge_gitlab_badge_registry [EXTRACTED 1.00]
- **Diátaxis framework enforced across standards, templates, and all language layers** — common_standards_diataxis_framework, common_quadrants_templates, python_standards, javascript_standards, skill_ezai_docs_writer [EXTRACTED 1.00]
- **Docs deploy cascade: CI generates coverage/changelog then builds and deploys with mike/vitepress-versioning** — python_plugins_deploy, javascript_plugins_deploy, concept_mike_versioning, concept_vitepress_versioning [EXTRACTED 0.95]

## Communities (6 total, 1 thin omitted)

### Community 0 - "Plugin Manifest & Metadata"
Cohesion: 0.22
Nodes (8): author, email, name, capabilities, category, description, name, version

### Community 1 - "Doc Standards & Style Rules"
Cohesion: 0.25
Nodes (9): Documentation writing standards (language-agnostic), Admonition semantics, Diátaxis framework, Emoji set for headings, JavaScript/TypeScript documentation standards (JSDoc/TSDoc + VitePress), JSDoc/TSDoc docstring convention, Python documentation standards (Google-style + MkDocs), Google-style docstring convention (+1 more)

### Community 2 - "Skill Core & Routing"
Cohesion: 0.32
Nodes (8): ezai-docs-writer plugin, Diátaxis quadrants and page templates, README reference standards, api/index.md (curated) vs api/reference/index.md (auto-dump) split, public-oss vs internal README profile, eval set docs-writer, References root router, ezai-docs-writer SKILL

### Community 3 - "Toolchain & Deployment"
Cohesion: 0.43
Nodes (7): mike versioning strategy, vitepress-versioning-plugin strategy, VitePress plugins and deployment (TypeDoc, vitepress-versioning-plugin, CI), JS/TS docs toolchain (VitePress + TypeDoc canonical config), Languages index (routing), MkDocs plugins and deployment (mike, CI), Python docs toolchain (MkDocs + Material canonical config)

### Community 4 - "Badge Registries"
Cohesion: 0.40
Nodes (6): Badge pair pattern (forge + language registries), Badge registry — GitHub, Badge registry — GitLab, Forge index (badge routing), Badge registry — JavaScript/TypeScript, Badge registry — Python

## Knowledge Gaps
- **13 isolated node(s):** `name`, `description`, `version`, `name`, `email` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Languages index (routing)` connect `Toolchain & Deployment` to `Doc Standards & Style Rules`, `Skill Core & Routing`, `Badge Registries`?**
  _High betweenness centrality (0.211) - this node is a cross-community bridge._
- **Why does `References root router` connect `Skill Core & Routing` to `Doc Standards & Style Rules`, `Toolchain & Deployment`, `Badge Registries`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **Why does `Documentation writing standards (language-agnostic)` connect `Doc Standards & Style Rules` to `Skill Core & Routing`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **What connects `name`, `description`, `version` to the rest of the system?**
  _17 weakly-connected nodes found - possible documentation gaps or missing edges._