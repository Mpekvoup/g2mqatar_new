import React from 'react';
import { renderHtml } from './render-html';
import { StaticRouter } from 'react-router-dom';
import App from '../App';

export function render(url: string): Promise<string> {
  return renderHtml(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
}
