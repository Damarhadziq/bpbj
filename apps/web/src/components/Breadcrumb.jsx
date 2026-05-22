import { Link } from 'react-router-dom';

/**
 * Breadcrumb — Accessible breadcrumb navigation
 * Renders semantic <nav> with <ol> and aria attributes
 * 
 * @param {Array} items - Array of { label: string, to?: string }
 *   Last item is the current page (no link)
 */
export default function Breadcrumb({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-6 pt-32 pb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-on-surface-variant" itemScope itemType="https://schema.org/BreadcrumbList">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={index}
              className="flex items-center gap-1.5"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {!isLast && item.to ? (
                <>
                  <Link
                    to={item.to}
                    className="hover:text-primary transition-colors font-medium"
                    itemProp="item"
                  >
                    <span itemProp="name">{item.label}</span>
                  </Link>
                  <meta itemProp="position" content={String(index + 1)} />
                  <span className="material-symbols-outlined text-xs opacity-40" aria-hidden="true">chevron_right</span>
                </>
              ) : (
                <>
                  <span className="font-semibold text-on-surface" itemProp="name" aria-current="page">
                    {item.label}
                  </span>
                  <meta itemProp="position" content={String(index + 1)} />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
