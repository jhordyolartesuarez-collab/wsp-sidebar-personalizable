# Graph Report - wsp-sidebar-personalizable-v1.0.8  (2026-11-05)

## Corpus Check
- 4 files · ~4,277 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .css 2, (none) 1)

## Summary
- 48 nodes · 73 edges · 7 communities (6 shown, 1 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1285db1e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- buildControls
- manifest.json
- default_icon
- scheduleDetection
- content.js
- icons

## God Nodes (most connected - your core abstractions)
1. `markSidebar()` - 8 edges
2. `buildControls()` - 8 edges
3. `scheduleDetection()` - 7 edges
4. `default_icon` - 5 edges
5. `icons` - 5 edges
6. `applySettings()` - 4 edges
7. `findPaneSide()` - 4 edges
8. `tryReveal()` - 4 edges
9. `checkFailsafe()` - 4 edges
10. `updateUI()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `loadSettings()` --calls--> `applySettings()`  [EXTRACTED]
  content.js → content.js  _Bridges community 0 → community 4_
- `scheduleDetection()` --calls--> `markSidebar()`  [EXTRACTED]
  content.js → content.js  _Bridges community 4 → community 3_
- `buildControls()` --calls--> `placeRailControl()`  [EXTRACTED]
  content.js → content.js  _Bridges community 3 → community 0_

## Import Cycles
- None detected.

## Communities (7 total, 1 thin omitted)

### Community 0 - "buildControls"
Cohesion: 0.32
Nodes (7): applySettings(), buildControls(), openPanel(), chatGearIcon(), positionPanel(), save(), updateUI()

### Community 1 - "manifest.json"
Cohesion: 0.25
Nodes (7): content_scripts, description, host_permissions, manifest_version, name, permissions, version

### Community 2 - "default_icon"
Cohesion: 0.25
Nodes (8): action, default_icon, default_popup, default_title, 128, 16, 32, 48

### Community 3 - "scheduleDetection"
Cohesion: 0.29
Nodes (7): backIcon(), ensureBackButton(), isOwnMutation(), placeRailControl(), scheduleDetection(), startStructuralObserver(), updateView()

### Community 4 - "content.js"
Cohesion: 0.44
Nodes (9): checkFailsafe(), findConversationPane(), findPaneSide(), findStructuralSidebar(), hasLayout(), loadSettings(), markDividerOwners(), markSidebar() (+1 more)

### Community 5 - "icons"
Cohesion: 0.40
Nodes (5): icons, 128, 16, 32, 48

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `action` connect `default_icon` to `manifest.json`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `icons` connect `icons` to `manifest.json`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._