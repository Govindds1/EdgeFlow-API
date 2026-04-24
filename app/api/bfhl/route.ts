import { NextResponse } from "next/server";

export const runtime = "nodejs";

const USER_ID = "govindraj_01032005"; // TODO: replace DDMMYYYY with your DOB (e.g. 09042004)
const EMAIL = "gr9313@srmist.edu.in"; // TODO: replace with your SRM email
const ROLL_NUMBER = "RA2311030010265"; // TODO: replace with your KTR roll number

type BfhlRequestBody = {
  data?: unknown;
};

interface TreeNode {
  [key: string]: TreeNode;
}

type HierarchyOk = { root: string; tree: TreeNode; depth: number };
type HierarchyCycle = { root: string; has_cycle: true; tree: TreeNode };
type Hierarchy = HierarchyOk | HierarchyCycle;

function withCors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.headers.set("Access-Control-Max-Age", "86400");
  return res;
}

function jsonCors(body: unknown, init?: ResponseInit) {
  return withCors(NextResponse.json(body, init));
}

function isValidEdge(s: string) {
  // Exactly "X->Y" where X and Y are single uppercase letters; no self loops.
  return /^[A-Z]->[A-Z]$/.test(s) && s[0] !== s[3];
}

function lexCompare(a: string, b: string) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function constructHierarchy(
  root: string,
  nodeAdjacencyList: Map<string, string[]>,
  visiting: Set<string>,
): { tree: TreeNode; depth: number } {
  // Depth is number of nodes along the longest path root->leaf.
  const dfs = (node: string): { subtree: TreeNode; depth: number } => {
    if (visiting.has(node)) {
      // Defensive guard; valid tree components should never hit this.
      return { subtree: {}, depth: 1 };
    }
    visiting.add(node);
    const outgoingChildren = nodeAdjacencyList.get(node) ?? [];
    let peakBranchLength = 0;
    const subtree: TreeNode = {};
    for (const child of outgoingChildren) {
      const { subtree: childSub, depth: childDepth } = dfs(child);
      subtree[child] = childSub;
      if (childDepth > peakBranchLength) peakBranchLength = childDepth;
    }
    visiting.delete(node);
    return { subtree, depth: 1 + peakBranchLength };
  };

  const { subtree, depth } = dfs(root);
  return { tree: { [root]: subtree }, depth };
}

function collectComponentNodesFromCycle(
  cycleNodes: Set<string>,
  nodeAdjacencyList: Map<string, string[]>,
) {
  const globalNodeSet = new Set<string>(cycleNodes);
  const pending: string[] = [...cycleNodes];
  while (pending.length) {
    const currentNode = pending.pop()!;
    const outgoingChildren = nodeAdjacencyList.get(currentNode) ?? [];
    for (const nextNode of outgoingChildren) {
      if (!globalNodeSet.has(nextNode)) {
        globalNodeSet.add(nextNode);
        pending.push(nextNode);
      }
    }
  }
  return globalNodeSet;
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function POST(req: Request) {
  let body: BfhlRequestBody;
  try {
    body = (await req.json()) as BfhlRequestBody;
  } catch {
    return jsonCors(
      {
        user_id: USER_ID,
        email_id: EMAIL,
        college_roll_number: ROLL_NUMBER,
        hierarchies: [],
        invalid_entries: [],
        duplicate_edges: [],
        summary: {
          total_trees: 0,
          total_cycles: 0,
          largest_tree_root: null,
        },
      },
      { status: 400 },
    );
  }

  const incomingNodes = body?.data;
  if (
    !Array.isArray(incomingNodes) ||
    !incomingNodes.every((candidate) => typeof candidate === "string")
  ) {
    return jsonCors(
      {
        user_id: USER_ID,
        email_id: EMAIL,
        college_roll_number: ROLL_NUMBER,
        hierarchies: [],
        invalid_entries: [],
        duplicate_edges: [],
        summary: {
          total_trees: 0,
          total_cycles: 0,
          largest_tree_root: null,
        },
      },
      { status: 400 },
    );
  }

  const invalid_entries: string[] = [];
  const duplicate_edges: string[] = [];

  const trackedConnections = new Set<string>();
  const duplicateGuardSet = trackedConnections;
  const nodeParentsMap = new Map<string, string>(); // child -> parent (first wins)
  const nodeAdjacencyList = new Map<string, string[]>(); // parent -> children in encounter order
  const globalNodeSet = new Set<string>();

  for (const rawEntry of incomingNodes) {
    const normalized = rawEntry.trim();
    if (!isValidEdge(normalized)) {
      invalid_entries.push(normalized);
      continue;
    }

    if (duplicateGuardSet.has(normalized)) {
      duplicate_edges.push(normalized);
      continue;
    }
    trackedConnections.add(normalized);

    const parent = normalized[0];
    const child = normalized[3];

    globalNodeSet.add(parent);
    globalNodeSet.add(child);

    // Diamond / multi-parent: first encountered parent wins, discard subsequent silently.
    if (nodeParentsMap.has(child)) continue;

    nodeParentsMap.set(child, parent);
    const existingChildren = nodeAdjacencyList.get(parent);
    if (existingChildren) existingChildren.push(child);
    else nodeAdjacencyList.set(parent, [child]);
  }

  // Roots are nodes that never appear as a child (i.e., have no parent).
  const roots: string[] = [];
  for (const node of globalNodeSet) {
    if (!nodeParentsMap.has(node)) roots.push(node);
  }
  roots.sort(lexCompare);

  const visitedFromRoots = new Set<string>();

  const trees: Array<{ root: string; tree: TreeNode; depth: number }> = [];
  let largestTreeRoot: string | null = null;
  let largestTreeDepth = -1;

  for (const root of roots) {
    const { tree, depth } = constructHierarchy(
      root,
      nodeAdjacencyList,
      new Set<string>(),
    );

    // Mark visited nodes (walk the built tree) for later cycle counting.
    const pending: string[] = [root];
    while (pending.length) {
      const currentNode = pending.pop()!;
      if (visitedFromRoots.has(currentNode)) continue;
      visitedFromRoots.add(currentNode);
      for (const child of nodeAdjacencyList.get(currentNode) ?? []) {
        pending.push(child);
      }
    }

    trees.push({ root, tree, depth });

    if (
      depth > largestTreeDepth ||
      (depth === largestTreeDepth &&
        largestTreeRoot !== null &&
        root < largestTreeRoot)
    ) {
      largestTreeDepth = depth;
      largestTreeRoot = root;
    }
    if (largestTreeRoot === null) largestTreeRoot = root;
  }

  // Any remaining nodes are part of components with no root => pure cycles (possibly with in-trees feeding into the cycle).
  const cycles: Array<{ root: string; has_cycle: true; tree: TreeNode }> = [];
  const assignedToCycleComponent = new Set<string>();

  for (const node of globalNodeSet) {
    if (visitedFromRoots.has(node) || assignedToCycleComponent.has(node)) continue;

    // Walk parent pointers until we repeat to find a cycle.
    const seenInWalk = new Map<string, number>();
    const path: string[] = [];
    let cursor: string | undefined = node;
    while (cursor !== undefined && !seenInWalk.has(cursor)) {
      seenInWalk.set(cursor, path.length);
      path.push(cursor);
      cursor = nodeParentsMap.get(cursor);
    }

    const cycleNodes = new Set<string>();
    if (cursor !== undefined) {
      const startIdx = seenInWalk.get(cursor)!;
      for (let index = startIdx; index < path.length; index++) {
        cycleNodes.add(path[index]);
      }
    }

    // Expand to full component nodes via reverse edges.
    const componentNodes = collectComponentNodesFromCycle(
      cycleNodes,
      nodeAdjacencyList,
    );
    for (const componentNode of componentNodes) {
      assignedToCycleComponent.add(componentNode);
    }

    let componentRoot = "";
    for (const componentNode of componentNodes) {
      if (componentRoot === "" || componentNode < componentRoot) {
        componentRoot = componentNode;
      }
    }

    cycles.push({ root: componentRoot, has_cycle: true, tree: {} });
  }

  cycles.sort((a, b) => lexCompare(a.root, b.root));

  const summary = {
    total_trees: trees.length,
    total_cycles: cycles.length,
    largest_tree_root: largestTreeRoot ?? null,
  };

  const hierarchies: Hierarchy[] = [
    ...trees.map(
      (t): HierarchyOk => ({
        root: t.root,
        tree: t.tree,
        depth: t.depth,
      }),
    ),
    ...cycles,
  ];

  const response = {
    user_id: USER_ID,
    email_id: EMAIL,
    college_roll_number: ROLL_NUMBER,
    hierarchies,
    invalid_entries,
    duplicate_edges,
    summary,
  };

  return jsonCors(response);
}
