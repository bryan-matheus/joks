import type { User } from "@prisma/client";
import type { LinksFunction, LoaderFunction } from "remix";
import { Link, Outlet, useLoaderData } from "remix";

import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import stylesUrl from "~/styles/profile.css";

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: stylesUrl }];
};

type LoaderData = {
    user: Awaited<ReturnType<typeof getUser>>;
    jokeListItems?: Array<{ id: string; name: string }>;
};

export const loader: LoaderFunction = async ({
    request
}) => {
    const jokeListItems = await db.joke.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true }
    });
    const user = await getUser(request);

    const data: LoaderData = {
        jokeListItems,
        user
    };
    return data;
};

export default function ProfileRoute() {
    const data = useLoaderData<LoaderData>();

    return (
        <div className="profile-layout">
            <main className="profile-main">
                <div className="container">
                    <div className="profile-list">
                        <h4>Settings</h4>
                        <ul>
                            <li>
                                <Link to={"/profile/edit"}>Edit profile</Link>
                            </li>
                            <li>
                                <Link to={"/profile/change-password"}>Change password</Link>
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
