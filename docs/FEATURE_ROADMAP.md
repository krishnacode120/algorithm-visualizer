# Feature Roadmap

This roadmap focuses on making the visualizer more educational, more interactive, and easier to grow without turning it into a cluttered demo.

## 1. New Algorithm Categories

| Category | Candidate Algorithms | Benefit |
| --- | --- | --- |
| Dynamic Programming | Fibonacci memoization, Knapsack, Longest Common Subsequence, Edit Distance | Helps learners understand overlapping subproblems, state tables, and recurrence design. |
| Trees | Binary Search Tree insert/delete/search, AVL rotations, Trie insert/search | Adds structure-focused learning beyond arrays and grids. |
| String Matching | Naive search, KMP, Rabin-Karp | Shows how preprocessing improves repeated comparisons. |
| Network Flow | Ford-Fulkerson, Edmonds-Karp | Introduces residual graphs and augmenting paths for advanced graph learning. |
| Greedy Scheduling | Activity selection, interval partitioning, Huffman coding | Makes "why greedy works" concrete through exchange arguments. |
| Computational Geometry | Convex hull, line sweep intersections | Adds visual algorithms that benefit strongly from animation. |

## 2. Active Learning

| Feature | How It Works | Benefit |
| --- | --- | --- |
| Prediction checkpoints | Pause before a key decision and ask which node/value/cell will be chosen next. | Turns passive watching into retrieval practice. |
| Progressive hints | Offer one hint at a time before revealing the answer. | Supports learners without instantly giving away the reasoning. |
| Misconception callouts | Explain common mistakes, such as why DFS does not guarantee shortest paths. | Teaches the boundaries of each algorithm. |
| Explain-back prompts | Ask users to summarize the invariant after a run. | Encourages deeper understanding and retention. |
| Adaptive difficulty | Increase input size or reduce hints after repeated correct answers. | Keeps practice challenging without being frustrating. |

## 3. Gamification

| Feature | How It Works | Benefit |
| --- | --- | --- |
| Challenge mode | Users predict next steps under a time or accuracy goal. | Adds motivation while reinforcing algorithmic reasoning. |
| Badges | Award badges for mastering categories, edge cases, or perfect predictions. | Gives learners visible progress markers. |
| Daily puzzle | Provide a small algorithm puzzle each day. | Encourages repeated practice. |
| Score breakdown | Separate points for correctness, speed, and explanation quality. | Rewards understanding, not just fast clicking. |
| Level map | Organize algorithms from beginner to advanced. | Makes the learning journey feel guided. |

## 4. Better Authoring And Editing

| Feature | How It Works | Benefit |
| --- | --- | --- |
| Drag-to-paint pathfinding | Click and drag to draw walls, erase cells, or move endpoints. | Makes grid creation much faster. |
| Graph builder canvas | Click to add nodes, drag to reposition, connect with weighted edges. | Removes the need to edit graph text manually. |
| Scenario presets | Save and load named arrays, boards, grids, and graphs. | Makes demos and classroom use repeatable. |
| Import/export JSON | Serialize current input and playback settings. | Enables sharing and testing exact cases. |
| Input validation panel | Show parse errors and invalid constraints before running. | Prevents silent failures and helps users fix data. |

## 5. Knowledge And Explanation Upgrades

| Feature | How It Works | Benefit |
| --- | --- | --- |
| Invariant panel | Display the invariant maintained by the current algorithm. | Explains why each step is correct. |
| Proof sketch mode | Show a short correctness argument beside the animation. | Bridges visualization and formal reasoning. |
| Complexity by phase | Split metrics into phases, such as partitioning vs recursion. | Makes runtime less abstract. |
| Pseudocode variables | Show live values for `i`, `j`, `pivot`, queue, stack, and distances. | Connects code to visual state. |
| Edge-case lessons | Provide targeted explanations for duplicates, disconnected graphs, and impossible boards. | Makes tricky cases intentional learning moments. |

## 6. Performance And Architecture

| Feature | How It Works | Benefit |
| --- | --- | --- |
| Web Worker execution | Generate heavy step histories off the main thread. | Keeps the UI responsive for large inputs. |
| Lazy-loaded categories | Load algorithm modules only when selected. | Reduces initial bundle size. |
| Step compression | Store deltas for large arrays/grids instead of full snapshots. | Reduces memory usage for long visualizations. |
| Canvas grid mode | Use canvas for large pathfinding boards. | Enables larger maps without DOM overhead. |
| Playback profiler | Show render time, generated steps, and memory estimates. | Helps maintain performance as features grow. |

## 7. Accessibility And Classroom Readiness

| Feature | How It Works | Benefit |
| --- | --- | --- |
| Reduced-motion mode | Replace continuous animation with discrete state changes. | Improves comfort and accessibility. |
| Captions for sound | Show a small text cue for compare/swap/visit sounds. | Keeps audio cues useful for all users. |
| Keyboard shortcuts | Add play/pause, step, reset, and speed controls. | Speeds up demos and keyboard-only use. |
| Presentation mode | Hide editing panels and enlarge visualizations. | Useful for teaching and screen sharing. |
| Export snapshots | Save current visualization state as PNG. | Helps with notes, assignments, and documentation. |

## Recommended Implementation Order

1. Drag-to-paint pathfinding and graph builder canvas.
2. Prediction checkpoints and invariant panel.
3. Dynamic programming category.
4. Scenario presets with JSON import/export.
5. Web Worker execution and lazy-loaded algorithm modules.
6. Challenge mode and badges.
