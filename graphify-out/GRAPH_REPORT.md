# Graph Report - wsp-sidebar-personalizable-v1.0.8  (2026-11-05)

## Corpus Check
- 6 files · ~6,189 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .css 2)

## Summary
- 66 nodes · 106 edges · 15 communities (10 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e00b6c42`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- navigate
- manifest.json
- default_icon
- buildControls
- markSidebar
- icons
- background
- closeOpenChat
- declarative_net_request
- content.js
- applySettings
- updateUI
- fitToViewport

## God Nodes (most connected - your core abstractions)
1. `buildControls()` - 9 edges
2. `markSidebar()` - 8 edges
3. `scheduleDetection()` - 8 edges
4. `closeOpenChat()` - 5 edges
5. `goBack()` - 5 edges
6. `fitToViewport()` - 5 edges
7. `default_icon` - 5 edges
8. `icons` - 5 edges
9. `applySettings()` - 4 edges
10. `findPaneSide()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `applySettings()` --calls--> `updateUI()`  [EXTRACTED]
  content.js → content.js  _Bridges community 12 → community 13_
- `loadSettings()` --calls--> `tryReveal()`  [EXTRACTED]
  content.js → content.js  _Bridges community 12 → community 4_
- `buildControls()` --calls--> `openFloating()`  [EXTRACTED]
  content.js → content.js  _Bridges community 11 → community 3_
- `scheduleDetection()` --calls--> `updateView()`  [EXTRACTED]
  content.js → content.js  _Bridges community 0 → community 3_
- `navigate()` --calls--> `goBack()`  [EXTRACTED]
  content.js → content.js  _Bridges community 9 → community 0_

## Import Cycles
- None detected.

## Communities (15 total, 5 thin omitted)

### Community 0 - "navigate"
Cohesion: 0.40
Nodes (5): flashGesture(), focusComposer(), goForward(), navigate(), updateView()

### Community 1 - "manifest.json"
Cohesion: 0.25
Nodes (7): content_scripts, description, host_permissions, manifest_version, name, permissions, version

### Community 2 - "default_icon"
Cohesion: 0.25
Nodes (8): action, default_icon, default_popup, default_title, 128, 16, 32, 48

### Community 3 - "buildControls"
Cohesion: 0.50
Nodes (4): buildControls(), chatGearIcon(), placeRailControl(), scheduleDetection()

### Community 4 - "markSidebar"
Cohesion: 0.36
Nodes (8): checkFailsafe(), findConversationPane(), findPaneSide(), findStructuralSidebar(), hasLayout(), markDividerOwners(), markSidebar(), tryReveal()

### Community 5 - "icons"
Cohesion: 0.40
Nodes (5): icons, 128, 16, 32, 48

### Community 9 - "closeOpenChat"
Cohesion: 0.50
Nodes (5): backIcon(), closeOpenChat(), ensureBackButton(), goBack(), pressEscape()

### Community 11 - "content.js"
Cohesion: 0.47
Nodes (4): coverTab(), isOwnMutation(), openFloating(), startStructuralObserver()

### Community 12 - "applySettings"
Cohesion: 0.67
Nodes (3): applySettings(), loadSettings(), save()

### Community 13 - "updateUI"
Cohesion: 0.67
Nodes (3): openPanel(), positionPanel(), updateUI()

## Knowledge Gaps
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `action` connect `default_icon` to `manifest.json`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `icons` connect `icons` to `manifest.json`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._