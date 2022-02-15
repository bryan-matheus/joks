import { User } from "@prisma/client";
import { LoaderFunction, MetaFunction, useCatch, useLoaderData, useParams } from "remix";
import { db } from "~/utils/db.server";

export const meta: MetaFunction = ({
    data
}: {
    data: LoaderData | undefined;
}) => {
    if (!data) {
        return {
            title: "No user",
            description: "No user found",
            "og:title": "No user",
            "og:description": "No user found",
            "og:type": "website",
            "twitter:title": "No user",
            "twitter:description": "No user found"
        };
    }
    return {
        title: `See "${data.user.username}" on Joks app`,
        description: `Enjoy with the "${data.user.username}" in the Joks app and much more`,
        "og:title": `See "${data.user.username}" on Joks app`,
        "og:description": `Enjoy with the "${data.user.username}" in the Joks app and much more`,
        "og:type": "website",
        "twitter:title": `See "${data.user.username}" on Joks app`,
        "twitter:description": `Enjoy with the "${data.user.username}" in the Joks app and much more`
    };
};

type LoaderData = { user: User };

export const loader: LoaderFunction = async ({params}) => {
    const user = await db.user.findUnique({
        where: { id: params.userId }
    });

    if (!user) {
        throw new Response("Uuh! Not found.", {
            status: 404
        });
    }

    const data: LoaderData = {
        user,
    };

    return data;
};

export default function UserRoute() {
    const data = useLoaderData<LoaderData>();

    return (
        <div className="container">
            <header className="content">
                <h3>{data.user.username}</h3>
                <p>{data.user.bio ?? "It looks like the user have no bio yet"}</p>
            </header>
        </div>
    );
}

export function CatchBoundary() {
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
                    Sorry, but {params.userId} is doesn't exists... Yet.
                </div>
            );
        }
        default: {
            throw new Error(`Unhandled error: ${caught.status}`);
        }
    }
}

export function ErrorBoundary({ error }: { error: Error }) {
    console.error(error);

    const { jokeId } = useParams();
    return (
        <div className="error-container">{`There was an error loading user by the id ${jokeId}. Sorry.`}</div>
    );
}
