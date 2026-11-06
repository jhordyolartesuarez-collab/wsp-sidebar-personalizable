# Graph Report - wsp-sidebar-personalizable-v1.0.8  (2026-11-05)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 44 nodes · 66 edges · 8 communities (6 shown, 2 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6

## God Nodes (most connected - your core abstractions)
1. `buildControls()` - 8 edges
2. `markSidebar()` - 8 edges
3. `scheduleDetection()` - 5 edges
4. `default_icon` - 5 edges
5. `icons` - 5 edges
6. `applySettings()` - 4 edges
7. `updateUI()` - 4 edges
8. `checkFailsafe()` - 4 edges
9. `findPaneSide()` - 4 edges
10. `tryReveal()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `loadSettings()` --calls--> `applySettings()`  [EXTRACTED]
  content.js → content.js  _Bridges community 0 → community 6_
- `scheduleDetection()` --calls--> `markSidebar()`  [EXTRACTED]
  content.js → content.js  _Bridges community 0 → community 4_
- `startStructuralObserver()` --calls--> `scheduleDetection()`  [EXTRACTED]
  content.js → content.js  _Bridges community 0 → community 3_
- `markSidebar()` --calls--> `findConversationPane()`  [EXTRACTED]
  content.js → content.js  _Bridges community 3 → community 4_
- `checkFailsafe()` --calls--> `tryReveal()`  [EXTRACTED]
  content.js → content.js  _Bridges community 4 → community 6_

## Import Cycles
- None detected.

## Communities (8 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.27
Nodes (9): applySettings(), buildControls(), openPanel(), chatGearIcon(), placeRailControl(), positionPanel(), save(), scheduleDetection() (+1 more)

### Community 1 - "Community 1"
Cohesion: 0.25
Nodes (7): content_scripts, description, host_permissions, manifest_version, name, permissions, version

### Community 2 - "Community 2"
Cohesion: 0.25
Nodes (8): action, default_icon, default_popup, default_title, 128, 16, 32, 48

### Community 3 - "Community 3"
Cohesion: 0.60
Nodes (4): findConversationPane(), hasLayout(), isOwnMutation(), startStructuralObserver()

### Community 4 - "Community 4"
Cohesion: 0.50
Nodes (5): checkFailsafe(), findPaneSide(), findStructuralSidebar(), markDividerOwners(), markSidebar()

### Community 5 - "Community 5"
Cohesion: 0.40
Nodes (5): icons, 128, 16, 32, 48

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `action` connect `Community 2` to `Community 1`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Why does `icons` connect `Community 5` to `Community 1`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._