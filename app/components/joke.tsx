import { Link, Form } from "remix";
import type { Joke, User } from "@prisma/client";

export function JokeDisplay({
    joke,
    isOwner,
    owner,
    canDelete = true
}: {
    joke: Pick<Joke, "content" | "name">;
    isOwner: boolean;
    canDelete?: boolean;
    owner?: User;
}) {
    return (
        <div>
            <p>Here's your hilarious joke:</p>
            <p>{joke.content}</p>
            <hr />
            <p>👉 by <Link to={`/users/${owner?.id}`}>{owner?.username}</Link></p>
            <Link to=".">Click to generate permalink for "{joke.name}"</Link>
            {isOwner ? (
                <Form method="post">
                    <input
                        type="hidden"
                        name="_method"
                        value="delete"
                    />
                    <button
                        type="submit"
                        className="button"
                        disabled={!canDelete}>
                        Delete
                    </button>
                </Form>
            ) : null}
        </div>
    );
}
