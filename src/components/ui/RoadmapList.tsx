import type { RoadmapNode } from "@/types/roadmap";

function RoadmapNodeLabel({ node }: { node: RoadmapNode }) {
  if (typeof node === "string") {
    return <>{node}</>;
  }
  return <>{node.label}</>;
}

function RoadmapNodeNote({ node }: { node: RoadmapNode }) {
  if (typeof node === "string" || !node.note) return null;
  return <p className="mt-1 text-xs italic text-uwa-white/40">{node.note}</p>;
}

function RoadmapChildren({ nodes }: { nodes: RoadmapNode[] }) {
  return (
    <ul className="mt-2 space-y-1.5 border-l border-uwa-panel-border pl-4">
      {nodes.map((node, index) => {
        const children = typeof node === "object" ? node.children : undefined;
        return (
          <li key={index} className="text-sm text-uwa-white/60">
            <span className="text-uwa-white/70">
              <RoadmapNodeLabel node={node} />
            </span>
            <RoadmapNodeNote node={node} />
            {children && children.length > 0 && (
              <RoadmapChildren nodes={children} />
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function RoadmapList({ items }: { items: RoadmapNode[] }) {
  return (
    <div className="grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => {
        const children = typeof item === "object" ? item.children : undefined;
        return (
          <div
            key={index}
            className="rounded-xl border border-uwa-panel-border bg-uwa-panel p-5"
          >
            <div className="font-heading text-base tracking-wide text-uwa-white">
              <RoadmapNodeLabel node={item} />
            </div>
            <RoadmapNodeNote node={item} />
            {children && children.length > 0 && (
              <RoadmapChildren nodes={children} />
            )}
          </div>
        );
      })}
    </div>
  );
}
