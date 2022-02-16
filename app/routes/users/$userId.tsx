import React from 'react';
import { Joke, User } from '@prisma/client';
import {
  Link,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  useCatch,
  useLoaderData,
  useParams
} from 'remix';
import { db } from '~/utils/db.server';
import stylesUrl from '~/styles/users.css';
import { getUser } from '~/utils/session.server';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

type LoaderData = {
  user: User;
  userJokes: Joke[];
  isCurrentUser: boolean;
};

type MetaProps = {
  data: LoaderData | undefined;
};

export const meta: MetaFunction = ({ data }: MetaProps) => {
  if (!data) {
    return {
      title: 'No user',
      description: 'No user found',
      'og:title': 'No user',
      'og:description': 'No user found',
      'og:type': 'website',
      'twitter:title': 'No user',
      'twitter:description': 'No user found'
    };
  }
  return {
    title: `See "${data.user.username}" on Joks app`,
    description: `Enjoy with the "${data.user.username}" in the Joks app and much more`,
    'og:title': `See "${data.user.username}" on Joks app`,
    'og:description': `Enjoy with the "${data.user.username}" in the Joks app and much more`,
    'og:type': 'website',
    'twitter:title': `See "${data.user.username}" on Joks app`,
    'twitter:description': `Enjoy with the "${data.user.username}" in the Joks app and much more`
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await db.user.findUnique({
    where: { id: params.userId }
  });

  if (!user) {
    throw new Response('Uuh! Not found.', {
      status: 404
    });
  }

  const currentUser = await getUser(request);

  const isCurrentUser = user.id === currentUser?.id;

  const userJokes = await db.joke.findMany({
    where: { jokesterId: params.userId }
  });

  const data: LoaderData = {
    user,
    userJokes,
    isCurrentUser
  };

  return data;
};

/**
 * Displays a route for a user.
 *
 * @return {React.ReactElement} - The User route.
 */
export default function UserRoute(): React.ReactElement {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="container">
      <header className="content users-header">
        <div>
          <h2 className="users-title">{data.user.username}</h2>
          <p>{data.user.bio ?? 'It looks like the user have no bio yet'}</p>
        </div>
        {data.isCurrentUser ? (
          <Link to={`/users/${data.user.id}/edit`}>Edit profile</Link>
        ) : null}
      </header>
      <section className="users-jokes">
        <h5 className="users-jokes-title users-title">Jokes posted</h5>
        {data.userJokes.map((joke) => (
          <Link
            to={`/jokes/${joke.id}`}
            className={'users-joke-link'}
            key={joke.id}
          >
            <article className="users-joke">
              <h6>{joke.name}</h6>
              <p>{joke.content}</p>
            </article>
          </Link>
        ))}
      </section>
    </div>
  );
}

/**
 * Catches errors and display them.
 *
 * @return {React.ReactElement} The error boundary.
 */
export function CatchBoundary(): React.ReactElement {
  const caught = useCatch();
  const params = useParams();

  switch (caught.status) {
    case 404: {
      return (
        <div className="error-container">
          Huh? What the heck is {params.userId}?
        </div>
      );
    }
    case 401: {
      return (
        <div className="error-container">
          Sorry, but {params.userId} is doesn&apos;t exists... Yet.
        </div>
      );
    }
    default: {
      throw new Error(`Unhandled error: ${caught.status}`);
    }
  }
}

/**
 * Catches error responses and displays a message.
 *
 * @return {React.ReactElement} The error message.
 */
export function ErrorBoundary({ error }: { error: Error }): React.ReactElement {
  console.error(error);

  const { jokeId } = useParams();
  return (
    <div className="error-container">{`There was an error loading user by the id ${jokeId}. Sorry.`}</div>
  );
}
