import React from 'react';
import type { LoaderFunction, ActionFunction, MetaFunction } from 'remix';
import { useLoaderData, useCatch, redirect, useParams } from 'remix';
import type { Joke, User } from '@prisma/client';

import { db } from '~/utils/db.server';
import { getUserId, requireUserId } from '~/utils/session.server';
import { JokeDisplay } from '~/components/joke';

export const meta: MetaFunction = ({
  data
}: {
  data: LoaderData | undefined;
}) => {
  if (!data) {
    return {
      title: 'No joke',
      description: 'No joke found',
      'og:title': 'No joke',
      'og:description': 'No joke found',
      'og:type': 'website',
      'twitter:title': 'No joke',
      'twitter:description': 'No joke found'
    };
  }
  return {
    title: `"${data.joke.name}" joke`,
    description: `Enjoy the "${data.joke.name}" joke and much more`,
    'og:title': `"${data.joke.name}" joke`,
    'og:description': `Enjoy the "${data.joke.name}" joke and much more`,
    'og:type': 'website',
    'twitter:title': `"${data.joke.name}" joke`,
    'twitter:description': `Enjoy the "${data.joke.name}" joke and much more`
  };
};

type LoaderData = { joke: Joke; isOwner: boolean; owner: User };

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await getUserId(request);

  const joke = await db.joke.findUnique({
    where: { id: params.jokeId }
  });

  if (!joke) {
    throw new Response('What a joke! Not found.', {
      status: 404
    });
  }

  const owner = await db.user.findUnique({
    where: { id: joke.jokesterId }
  });

  const data: LoaderData = {
    joke,
    isOwner: userId === joke.jokesterId,
    owner: owner as User
  };

  return data;
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  if (form.get('_method') === 'delete') {
    const userId = await requireUserId(request);
    const joke = await db.joke.findUnique({
      where: { id: params.jokeId }
    });
    if (!joke) {
      throw new Response("Can't delete what does not exist", { status: 404 });
    }
    if (joke.jokesterId !== userId) {
      throw new Response("Pssh, nice try. That's not your joke", {
        status: 401
      });
    }
    await db.joke.delete({ where: { id: params.jokeId } });
    return redirect('/jokes');
  }
};

/**
 * Displays a single joke.
 *
 * @return {React.ReactElement} The joke route.
 */
export default function JokeRoute(): React.ReactElement {
  const data = useLoaderData<LoaderData>();

  return (
    <JokeDisplay joke={data.joke} owner={data.owner} isOwner={data.isOwner} />
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
          Huh? What the heck is {params.jokeId}?
        </div>
      );
    }
    case 401: {
      return (
        <div className="error-container">
          Sorry, but {params.jokeId} is not your joke.
        </div>
      );
    }
    default: {
      throw new Error(`Unhandled error: ${caught.status}`);
    }
  }
}

/**
 * Catches errors and display them.
 *
 * @return {React.ReactElement} The error boundary.
 */
export function ErrorBoundary({ error }: { error: Error }): React.ReactElement {
  console.error(error);

  const { jokeId } = useParams();
  return (
    <div className="error-container">
      {`There was an error loading joke by the id ${jokeId}. Sorry.`}
    </div>
  );
}
