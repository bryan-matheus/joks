import React from 'react';
import type { ActionFunction, LoaderFunction } from 'remix';
import {
  useActionData,
  redirect,
  json,
  useCatch,
  Link,
  Form,
  useTransition
} from 'remix';

import { JokeDisplay } from '~/components/joke';
import { db } from '~/utils/db.server';
import { validateJokeContent, validateJokeName } from '~/utils/joke.helper';
import { requireUserId, getUserId } from '~/utils/session.server';

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (!userId) {
    throw new Response('Unauthorized', { status: 401 });
  }
  return {};
};

type ActionData = {
  formError?: string;
  fieldErrors?: {
    name: string | undefined;
    content: string | undefined;
  };
  fields?: {
    name: string;
    content: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const name = form.get('name');
  const content = form.get('content');
  if (typeof name !== 'string' || typeof content !== 'string') {
    return badRequest({
      formError: `Form not submitted correctly.`
    });
  }

  const fieldErrors = {
    name: validateJokeName(name),
    content: validateJokeContent(content)
  };
  const fields = { name, content };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const joke = await db.joke.create({
    data: { ...fields, jokesterId: userId }
  });
  return redirect(`/jokes/${joke.id}`);
};

/**
 * Displays a route for creating a new joke.
 *
 * @return {React.ReactElement} The New joke route.
 */
export default function NewJokeRoute(): React.ReactElement {
  const actionData = useActionData<ActionData>();
  const transition = useTransition();

  if (transition.submission) {
    const name = transition.submission.formData.get('name');
    const content = transition.submission.formData.get('content');
    if (
      typeof name === 'string' &&
      typeof content === 'string' &&
      !validateJokeContent(content) &&
      !validateJokeName(name)
    ) {
      return (
        <JokeDisplay
          joke={{ name, content }}
          isOwner={true}
          canDelete={false}
        />
      );
    }
  }

  return (
    <div>
      <p>Add your own hilarious joke</p>
      <Form method="post">
        <div>
          <label>
            Name:{' '}
            <input
              type="text"
              defaultValue={actionData?.fields?.name}
              name="name"
              aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
              aria-describedby={
                actionData?.fieldErrors?.name ? 'name-error' : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p className="form-validation-error" role="alert" id="name-error">
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label>
            Content:{' '}
            <textarea
              defaultValue={actionData?.fields?.content}
              name="content"
              aria-invalid={
                Boolean(actionData?.fieldErrors?.content) || undefined
              }
              aria-describedby={
                actionData?.fieldErrors?.content ? 'content-error' : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.content ? (
            <p
              className="form-validation-error"
              role="alert"
              id="content-error"
            >
              {actionData.fieldErrors.content}
            </p>
          ) : null}
        </div>
        <div>
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </Form>
    </div>
  );
}

/**
 * Catches errors and display them.
 *
 * @return {React.ReactElement} The error boundary.
 */
export function CatchBoundary(): React.ReactElement | undefined {
  const caught = useCatch();

  if (caught.status === 401) {
    return (
      <div className="error-container">
        <p>You must be logged in to create a joke.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }
}

/**
 * Catches error responses and displays a message.
 *
 * @return {React.ReactElement} The error message.
 */
export function ErrorBoundary({ error }: { error: Error }): React.ReactElement {
  console.error(error);

  return (
    <div className="error-container">
      Something unexpected went wrong. Sorry about that.
    </div>
  );
}
