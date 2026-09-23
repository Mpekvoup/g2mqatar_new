import React from 'react';
import { renderHtml } from './render-html';
import { StaticRouter } from 'react-router-dom';
import App from '../App';

// Re-export manifest functions for prerender script
export { getRouteManifest, getPrerenderRoutes, getSitemapRoutes } from './routes/manifest';
export type { RouteManifestEntry, SitemapChangeFrequency } from './routes/manifest';

export function render(url: string): Promise<string> {
  return renderHtml(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
}
