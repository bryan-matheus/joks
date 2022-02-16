import React from 'react';
import type { LinksFunction, MetaFunction } from 'remix';
import { Link } from 'remix';

import stylesUrl from '~/styles/index.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

export const meta: MetaFunction = () => ({
  title: "So great, it's funny!",
  description: 'Some dad jokes and more for you!'
});

/**
 * Displays the index route.
 *
 * @return {React.ReactElement} - The index route.
 */
export default function Index(): React.ReactElement {
  return (
    <div className="container">
      <div className="content">
        <h1>
          <span>J🤪KS</span>
        </h1>
        <nav>
          <ul>
            <li>
              <Link to="jokes">Read Jokes</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
