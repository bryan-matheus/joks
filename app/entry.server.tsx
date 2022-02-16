import React from 'react';
import { renderToString } from 'react-dom/server';
import { RemixServer } from 'remix';
import type { EntryContext } from 'remix';

/**
 * Handle the rendering of the Remix browser.
 *
 * @param {Request} request - The incoming request.
 * @param {number} responseStatusCode - The response status code.
 * @param {Headers} responseHeaders - The response headers.
 * @param {EntryContexts} remixContext - The remix context.
 * @return {Response} The rendered HTML.
 */
export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
): Response {
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set('Content-Type', 'text/html');

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  });
}
