"use client";
import React, { useMemo } from "react";
import clsx from "clsx";
import Link from "next/link";
import DOMPurify from "dompurify";
import styles from "./index.module.scss";

export function ProjectRow({ 
  block, 
  index,
  isPhone,
  hoveredIndex,
  openedIndex,
  onHover,
  onToggle,
  onMouseMove 
}) {
  const isOpen = openedIndex === index;
  const isHovered = hoveredIndex === index;

  // Pre-sanitize description once, not on every render
  const sanitizedDescription = useMemo(() => {
    if (typeof window === 'undefined' || !block.description) {
      return block.description || '';
    }
    
    return DOMPurify.sanitize(block.description, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'src', 'alt', 'title']
    });
  }, [block.description]);

  const handleToggle = () => {
    onToggle(isOpen ? null : index);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <React.Fragment key={block.slug || block.id || `project-${index}`}>
      <div
        className={styles.row}
        onMouseEnter={() => !isPhone && onHover(index)}
        onMouseLeave={() => !isPhone && onHover(null)}
        onMouseMove={onMouseMove}
      >
        <Link
          href={`/projects/${block.slug}`}
          className={clsx(styles.col, styles.title)}
          data-cat={block.category}
        >
          {block.name}
        </Link>
        <div className={clsx(styles.col, styles.category)}>
          {block.category}
        </div>
        <div className={clsx(styles.col, styles.desc)}>
          {block.description}
        </div>
        <div className={clsx(styles.col, styles.collapseButton)}>
          <button
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            aria-expanded={isOpen}
            aria-controls={`project-description-${block.slug || index}`}
            aria-label={isOpen ? "Collapse project description" : "Expand project description"}
            type="button"
          >
            {isOpen ? "[-]" : "[+]"}
          </button>
        </div>
      </div>
      <div
        id={`project-description-${block.slug || index}`}
        className={clsx(styles.row, styles.rowCollapsed, {
          [styles.open]: isOpen,
        })}
        role="region"
        aria-hidden={!isOpen}
        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
      />
    </React.Fragment>
  );
}

