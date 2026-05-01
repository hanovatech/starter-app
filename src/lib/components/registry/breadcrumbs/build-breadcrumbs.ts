export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface DynamicSegmentMapping {
  dataKey: string;
  property: string;
  resolve?: (data: Record<string, Record<string, unknown>>) => string | undefined;
}

export interface BuildBreadcrumbsOptions {
  pathname: string;
  data?: Record<string, Record<string, unknown>>;
  labels?: Record<string, string>;
  prefixes?: string[];
  dynamicSegments?: Record<string, DynamicSegmentMapping>;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function buildBreadcrumbs(options: BuildBreadcrumbsOptions): BreadcrumbItem[] {
  const { pathname, data = {}, labels = {}, prefixes = [], dynamicSegments = {} } = options;

  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return [];

  const rolePrefix = prefixes.includes(segments[0]) ? segments[0] : null;
  const contentSegments = rolePrefix ? segments.slice(1) : segments;
  const basePath = rolePrefix ? `/${rolePrefix}` : '';

  const items: BreadcrumbItem[] = [];
  let currentPath = basePath;

  for (let i = 0; i < contentSegments.length; i++) {
    const segment = contentSegments[i];
    currentPath += `/${segment}`;

    if (UUID_REGEX.test(segment)) {
      const prevSegment = contentSegments[i - 1];
      const mapping = prevSegment ? dynamicSegments[prevSegment] : null;

      if (mapping) {
        let label: string | undefined;
        if (mapping.resolve) {
          label = mapping.resolve(data);
        } else {
          const entity = data[mapping.dataKey];
          const value = entity?.[mapping.property];
          label = typeof value === 'string' ? value : undefined;
        }
        items.push({ label: label ?? segment.slice(0, 8), href: currentPath });
      } else {
        items.push({ label: segment.slice(0, 8), href: currentPath });
      }
    } else {
      const label = labels[segment] ?? formatSegment(segment);
      items.push({ label, href: currentPath });
    }
  }

  return items;
}

function formatSegment(segment: string): string {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
