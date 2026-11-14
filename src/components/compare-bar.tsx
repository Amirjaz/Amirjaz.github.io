// Temporary switcher for comparing design candidates. Delete it (and the routes you
// don't pick) once a design is chosen. Styles are inline so it looks the same on every design.

const designs = [
  { id: "current", label: "Current", href: "/" },
  { id: "a1", label: "A1 REC", href: "/a1/" },
  { id: "a5", label: "A5 Smooth", href: "/a5/" },
  { id: "b2", label: "B2 Sidebar + TV", href: "/b2/" },
] as const;

export type DesignId = (typeof designs)[number]["id"];

export function CompareBar({ current }: { current: DesignId }) {
  return (
    <nav
      aria-label="Compare designs"
      style={{
        position: "fixed",
        left: "50%",
        bottom: 14,
        transform: "translateX(-50%)",
        zIndex: 2147483000,
        display: "flex",
        gap: 2,
        padding: 3,
        borderRadius: 9,
        background: "rgba(20,20,19,0.92)",
        border: "1px solid rgba(255,255,255,0.16)",
        font: "500 12px/1 ui-sans-serif, system-ui, sans-serif",
        whiteSpace: "nowrap",
        maxWidth: "calc(100vw - 16px)",
        overflowX: "auto",
      }}
    >
      {designs.map((d) => {
        const active = d.id === current;
        return (
          <a
            key={d.id}
            href={d.href}
            aria-current={active ? "page" : undefined}
            style={{
              padding: "8px 11px",
              borderRadius: 6,
              textDecoration: "none",
              color: active ? "#141413" : "rgba(255,255,255,0.78)",
              background: active ? "#f3f1ec" : "transparent",
            }}
          >
            {d.label}
          </a>
        );
      })}
    </nav>
  );
}
