# Graph Report - wsp-sidebar-personalizable-v1.0.8  (2026-11-05)

## Corpus Check
- 6 files · ~7,161 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .css 2)

## Summary
- 69 nodes · 111 edges · 8 communities (6 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f2adee14`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- navigate
- manifest.json
- default_icon
- buildControls
- markSidebar
- content.js

## God Nodes (most connected - your core abstractions)
1. `buildControls()` - 9 edges
2. `markSidebar()` - 8 edges
3. `scheduleDetection()` - 8 edges
4. `closeOpenChat()` - 5 edges
5. `goBack()` - 5 edges
6. `default_icon` - 5 edges
7. `icons` - 5 edges
8. `applySettings()` - 4 edges
9. `findPaneSide()` - 4 edges
10. `updateView()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `loadSettings()` --calls--> `tryReveal()`  [EXTRACTED]
  content.js → content.js  _Bridges community 3 → community 4_
- `buildControls()` --calls--> `openFloating()`  [EXTRACTED]
  content.js → content.js  _Bridges community 11 → community 3_
- `scheduleDetection()` --calls--> `updateView()`  [EXTRACTED]
  content.js → content.js  _Bridges community 0 → community 11_
- `scheduleDetection()` --calls--> `markSidebar()`  [EXTRACTED]
  content.js → content.js  _Bridges community 4 → community 11_

## Import Cycles
- None detected.

## Communities (8 total, 2 thin omitted)

### Community 0 - "navigate"
Cohesion: 0.29
Nodes (8): closeOpenChat(), flashGesture(), focusComposer(), goBack(), goForward(), navigate(), pressEscape(), updateView()

### Community 1 - "manifest.json"
Cohesion: 0.12
Nodes (16): background, service_worker, content_scripts, declarative_net_request, rule_resources, description, host_permissions, icons (+8 more)

### Community 2 - "default_icon"
Cohesion: 0.25
Nodes (8): action, default_icon, default_popup, default_title, 128, 16, 32, 48

### Community 3 - "buildControls"
Cohesion: 0.28
Nodes (8): applySettings(), buildControls(), openPanel(), chatGearIcon(), loadSettings(), positionPanel(), save(), updateUI()

### Community 4 - "markSidebar"
Cohesion: 0.36
Nodes (8): checkFailsafe(), findConversationPane(), findPaneSide(), findStructuralSidebar(), hasLayout(), markDividerOwners(), markSidebar(), tryReveal()

### Community 11 - "content.js"
Cohesion: 0.24
Nodes (13): backIcon(), coverTab(), ensureBackButton(), fitPass(), fitToViewport(), insideCarousel(), isOwnMutation(), nudgeIntoView() (+5 more)

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `action` connect `default_icon` to `manifest.json`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Should `manifest.json` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._