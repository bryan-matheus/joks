import React from 'react';
import type { LoaderFunction } from 'remix';
import { useLoaderData, Link, useCatch } from 'remix';
import type { Joke } from '@prisma/client';

import { db } from '~/utils/db.server';

type LoaderData = { randomJoke: Joke };

export const loader: LoaderFunction = async () => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: randomRowNumber
  });
  if (!randomJoke) {
    throw new Response('No random joke found', {
      status: 404
    });
  }
  const data: LoaderData = { randomJoke };
  return data;
};

/**
 * Displays a random joke.
 *
 * @return {React.ReactElement} The Jokes route.
 */
export default function JokesIndexRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Here&apos;s a random joke:</p>
      <p>{data.randomJoke.content}</p>
      <Link to={data.randomJoke.id}>
        &quot;{data.randomJoke.name}&quot; Permalink
      </Link>
    </div>
  );
}

/**
 * Catches error responses and displays a message.
 *
 * @return {React.ReactElement} The error message.
 */
export function CatchBoundary(): React.ReactElement {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <div className="error-container">There are no jokes to display.</div>
    );
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

/**
 * Catches error responses and displays a message.
 *
 * @return {React.ReactElement} The error message.
 */
export function ErrorBoundary(): React.ReactElement {
  return <div className="error-container">I did a whoopsies.</div>;
}
