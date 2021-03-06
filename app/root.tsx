import React from 'react';
import type { LinksFunction, MetaFunction } from 'remix';
import { Links, LiveReload, Outlet, useCatch, Meta, Scripts } from 'remix';

import globalStylesUrl from './styles/global.css';
import globalMediumStylesUrl from './styles/global-medium.css';
import globalLargeStylesUrl from './styles/global-large.css';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: globalStylesUrl
    },
    {
      rel: 'stylesheet',
      href: globalMediumStylesUrl,
      media: 'print, (min-width: 640px)'
    },
    {
      rel: 'stylesheet',
      href: globalLargeStylesUrl,
      media: 'screen and (min-width: 1024px)'
    }
  ];
};

export const meta: MetaFunction = () => {
  const description = `Laugh with awesome jokes!`;
  return {
    description,
    keywords: 'dad,jokes,programmer',
    'twitter:image': 'https://joks.fly.dev/social.png',
    'twitter:card': 'summary_large_image',
    'twitter:creator': '@remix_run',
    'twitter:site': '@remix_run',
    'twitter:title': 'Joks',
    'twitter:description': description
  };
};

type DocumentProps = {
  children: React.ReactNode;
  title?: string;
};

/**
 * Display the document.
 *
 * @param {DocumentProps} props - The document props.
 * @return {React.ReactElement} The document.
 */
function Document({
  children,
  title = `So great, it's funny!`
}: DocumentProps): React.ReactElement {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
        {process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
      </body>
    </html>
  );
}

/**
 * Displays the app.
 *
 * @return {React.ReactElement} The app.
 */
export default function App(): React.ReactElement {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

/**
 * Catches errors and display them.
 *
 * @return {React.ReactElement} The error boundary.
 */
export function CatchBoundary(): React.ReactElement {
  const caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <div className="error-container">
        <h1>
          {caught.status} {caught.statusText}
        </h1>
      </div>
    </Document>
  );
}

/**
 * Catches error on the app and display them.
 *
 * @param {{error: Error}} props - The ErrorBoundary props.
 * @return {React.ReactElement} The ErrorBoundary.
 */
export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return (
    <Document title="Uh-oh!">
      <div className="error-container">
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </div>
    </Document>
  );
}
