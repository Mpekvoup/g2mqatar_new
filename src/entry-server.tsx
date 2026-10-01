import React from 'react';
import { renderHtml } from './render-html';
import { StaticRouter } from 'react-router-dom';
import App from '../App';
import { SERVICES_DETAIL } from '../servicesData';
import { CASE_STUDIES } from '../caseStudiesData';

// Re-export manifest functions for prerender script
export { getRouteManifest, getPrerenderRoutes, getSitemapRoutes } from './routes/manifest';
export type { RouteManifestEntry, SitemapChangeFrequency } from './routes/manifest';

// Export data for prerender metadata generation
export function getServicesData() {
  return SERVICES_DETAIL;
}

export function getCaseStudiesData() {
  return CASE_STUDIES;
}

export function render(url: string): Promise<string> {
  return renderHtml(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
}
