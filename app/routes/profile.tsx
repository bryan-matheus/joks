import React from 'react';
import type { LinksFunction, LoaderFunction } from 'remix';
import { Link, Outlet } from 'remix';
import { db } from '~/utils/db.server';
import { getUser } from '~/utils/session.server';
import stylesUrl from '~/styles/profile.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  jokeListItems?: Array<{ id: string; name: string }>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const jokeListItems = await db.joke.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true }
  });
  const user = await getUser(request);

  const data: LoaderData = {
    jokeListItems,
    user
  };
  return data;
};

/**
 * Displays the profile outlet.
 *
 * @return {React.ReactElement} - The profile outlet.
 */
export default function ProfileRoute(): React.ReactElement {
  return (
    <div className="profile-layout">
      <header className="profile-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="Joks" aria-label="Joks">
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KS</span>
            </Link>
          </h1>
          <div className="user-info">
            <Link to="/jokes">Back to home</Link>
            <form action="/logout" method="post">
              <button type="submit" className="button">
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="profile-main">
        <div className="container">
          <div className="profile-list">
            <h4>Settings</h4>
            <ul>
              <li>
                <Link to={'/profile/edit'}>Edit profile</Link>
              </li>
              <li>
                <Link to={'/profile/change-password'}>Change password</Link>
              </li>
            </ul>
          </div>
          <div className="profile-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
