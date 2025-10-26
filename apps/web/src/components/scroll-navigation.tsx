"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface NavigationItem {
  id: string;
  label: string;
}

interface ScrollNavigationProps {
  items: NavigationItem[];
  className?: string;
}

export function ScrollNavigation({ items, className }: ScrollNavigationProps) {
  const [activeSection, setActiveSection] = useState<string>(items[0]?.id || "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(item.id);
            }
          });
        },
        {
          rootMargin: "-20% 0px -70% 0px",
          threshold: 0,
        },
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [items]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // 헤더 높이만큼 오프셋
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      className={cn(
        "sticky top-0 z-10 bg-white border-b border-gray-200 mb-6",
        className,
      )}
    >
      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollToSection(item.id)}
            className={cn(
              "px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative",
              "hover:text-gray-900",
              activeSection === item.id
                ? "text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gray-900"
                : "text-gray-500",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
