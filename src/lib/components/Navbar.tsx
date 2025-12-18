import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import TopBarAvatar from "./TopBarAvatar";
import { useRef, useState, useLayoutEffect } from "react";

const navLinks = [
  { to: "/app/horizon", label: "Horizon" },
  { to: "/app/week", label: "Week" },
  { to: "/app/ledger", label: "Ledger" },
  { to: "/app/records", label: "Records" },
];

export default function Navbar() {
  const location = useLocation();
  const navRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const [isHovering, setIsHovering] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });

  const getActiveIndex = () => navLinks.findIndex((link) => location.pathname.startsWith(link.to));

  const updateIndicator = (element: HTMLLIElement | null | undefined) => {
    if (!element || !navRef.current) return;
    const navRect = navRef.current.getBoundingClientRect();
    const targetRect = element.getBoundingClientRect();
    setIndicatorStyle({
      left: targetRect.left - navRect.left,
      width: targetRect.width,
      opacity: 1,
    });
  };

  // Position indicator on active link on mount and route change
  useLayoutEffect(() => {
    const activeIndex = getActiveIndex();
    if (activeIndex >= 0) {
      const activeLink = navLinks[activeIndex];
      const element = itemRefs.current.get(activeLink.to);
      updateIndicator(element);
    }
  }, [location.pathname]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLLIElement>) => {
    setIsHovering(true);
    updateIndicator(e.currentTarget);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Return to active link
    const activeIndex = getActiveIndex();
    if (activeIndex >= 0) {
      const activeLink = navLinks[activeIndex];
      const element = itemRefs.current.get(activeLink.to);
      updateIndicator(element);
    } else {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  return (
    <header className="border-b w-full flex items-center justify-between px-6 py-3 ">
      <NavLink to="/" className="flex items-center gap-2">
        <span className="text-xl font-semibold tracking-tight text-primary">RunOS</span>
      </NavLink>

      <ul ref={navRef} className="relative flex items-center gap-1" onMouseLeave={handleMouseLeave}>
        <li
          className={cn(
            "absolute top-0 h-full rounded-md pointer-events-none transition-all duration-200 ease-out",
            isHovering ? "bg-accent/50" : "bg-accent"
          )}
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
            opacity: indicatorStyle.opacity,
          }}
        />
        {navLinks.map((link) => (
          <li
            key={link.to}
            ref={(el) => {
              if (el) itemRefs.current.set(link.to, el);
            }}
            onMouseEnter={handleMouseEnter}
          >
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "block px-4 py-2 text-sm font-medium rounded-md transition-colors relative z-10",
                  isActive ? "text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <TopBarAvatar />
    </header>
  );
}
