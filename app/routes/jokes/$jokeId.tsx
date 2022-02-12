import type { LoaderFunction } from "remix";
import {
    Link,
    useLoaderData,
    useCatch,
    useParams
} from "remix";
import type { Joke } from "@prisma/client";

import { db } from "~/utils/db.server";

type LoaderData = { joke: Joke };

export const loader: LoaderFunction = async ({
    params
}) => {
    const joke = await db.joke.findUnique({
        where: { id: params.jokeId }
    });
    if (!joke) {
        throw new Response("What a joke! Not found.", {
            status: 404
        });
    }
    const data: LoaderData = { joke };
    return data;
};

export default function JokeRoute() {
    const data = useLoaderData<LoaderData>();

    return (
        <div>
            <p>Here's your hilarious joke:</p>
            <p>{data.joke.content}</p>
            <Link to=".">{data.joke.name} Permalink</Link>
        </div>
    );
}

export function CatchBoundary() {
    const caught = useCatch();
    const params = useParams();
    if (caught.status === 404) {
        return (
            <div className="error-container">
                Huh? What the heck is "{params.jokeId}"?
            </div>
        );
    }
    throw new Error(`Unhandled error: ${caught.status}`);
}

export function ErrorBoundary() {
    const { jokeId } = useParams();
    return (
        <div className="error-container">{`There was an error loading joke by the id ${jokeId}. Sorry.`}</div>
    );
}
