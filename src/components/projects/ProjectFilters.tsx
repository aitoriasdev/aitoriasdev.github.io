import { useState } from "react";
import { ALL_TAGS } from "../../config/tags";

interface Props {
  filterAriaLabel: string;
  allLabel: string; // <-- ADD PROP
}

export default function ProjectFilters({ filterAriaLabel, allLabel }: Props) {
  const [activeTag, setActiveTag] = useState("All");

  const handleFilter = (tag: string) => {
    setActiveTag(tag);

    // Filter project cards in DOM
    const cards = document.querySelectorAll<HTMLElement>(".project-card");
    cards.forEach((card) => {
      const cardTags = JSON.parse(card.getAttribute("data-tags") || "[]");
      if (tag === "All" || cardTags.includes(tag)) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  };

  return (
    <div
      className="custom-scrollbar mt-6 -mx-6 flex items-center gap-2 overflow-x-auto px-6 pb-3 pt-1 sm:mx-0 sm:mt-0 sm:flex-wrap sm:overflow-x-visible sm:px-0 sm:pb-0 sm:pt-0"
      role="group"
      aria-label={filterAriaLabel}
    >
      {ALL_TAGS.map((tag) => {
        const isActive = activeTag === tag;
        return (
          <button
            key={tag}
            type="button"
            onClick={() => handleFilter(tag)}
            aria-pressed={isActive}
            data-active={isActive ? "true" : "false"}
            className={`filter-btn shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-accent-primary text-white dark:bg-accent-primary-dark dark:text-bg-dark shadow-sm"
                : "bg-surface-light/70 text-text-muted-light dark:bg-surface-dark/70 dark:text-text-muted-dark hover:bg-accent-primary/10 hover:text-accent-primary"
            }`}
          >
            {/* Display localized 'allLabel' for 'All' tag */}
            {tag === "All" ? allLabel : tag}
          </button>
        );
      })}
    </div>
  );
}
