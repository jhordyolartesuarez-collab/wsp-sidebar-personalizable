# Graph Report - wsp-sidebar-personalizable-v1.0.8  (2026-11-05)

## Corpus Check
- 6 files · ~5,580 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .css 2)

## Summary
- 59 nodes · 90 edges · 11 communities (8 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3f3eb93e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- buildControls
- manifest.json
- default_icon
- buildControls
- content.js
- icons
- content.js
- closeOpenChat
- fitToViewport

## God Nodes (most connected - your core abstractions)
1. `buildControls()` - 9 edges
2. `markSidebar()` - 8 edges
3. `scheduleDetection()` - 8 edges
4. `fitToViewport()` - 5 edges
5. `default_icon` - 5 edges
6. `icons` - 5 edges
7. `applySettings()` - 4 edges
8. `findPaneSide()` - 4 edges
9. `closeOpenChat()` - 4 edges
10. `ensureBackButton()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `loadSettings()` --calls--> `applySettings()`  [EXTRACTED]
  content.js → content.js  _Bridges community 0 → community 4_
- `buildControls()` --calls--> `openFloating()`  [EXTRACTED]
  content.js → content.js  _Bridges community 6 → community 3_
- `scheduleDetection()` --calls--> `fitToViewport()`  [EXTRACTED]
  content.js → content.js  _Bridges community 10 → community 3_
- `scheduleDetection()` --calls--> `ensureBackButton()`  [EXTRACTED]
  content.js → content.js  _Bridges community 9 → community 3_
- `scheduleDetection()` --calls--> `markSidebar()`  [EXTRACTED]
  content.js → content.js  _Bridges community 4 → community 3_

## Import Cycles
- None detected.

## Communities (11 total, 3 thin omitted)

### Community 0 - "buildControls"
Cohesion: 0.40
Nodes (5): applySettings(), openPanel(), positionPanel(), save(), updateUI()

### Community 1 - "manifest.json"
Cohesion: 0.17
Nodes (11): background, service_worker, content_scripts, declarative_net_request, rule_resources, description, host_permissions, manifest_version (+3 more)

### Community 2 - "default_icon"
Cohesion: 0.25
Nodes (8): action, default_icon, default_popup, default_title, 128, 16, 32, 48

### Community 3 - "buildControls"
Cohesion: 0.40
Nodes (5): buildControls(), chatGearIcon(), placeRailControl(), scheduleDetection(), updateView()

### Community 4 - "content.js"
Cohesion: 0.31
Nodes (9): checkFailsafe(), findConversationPane(), findPaneSide(), findStructuralSidebar(), hasLayout(), loadSettings(), markDividerOwners(), markSidebar() (+1 more)

### Community 5 - "icons"
Cohesion: 0.40
Nodes (5): icons, 128, 16, 32, 48

### Community 6 - "content.js"
Cohesion: 0.60
Nodes (4): coverTab(), isOwnMutation(), openFloating(), startStructuralObserver()

### Community 9 - "closeOpenChat"
Cohesion: 0.67
Nodes (3): backIcon(), closeOpenChat(), ensureBackButton()

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `action` connect `default_icon` to `manifest.json`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `icons` connect `icons` to `manifest.json`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._