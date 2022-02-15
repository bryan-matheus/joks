import { User } from "@prisma/client";
import { Form, LoaderFunction, useLoaderData } from "remix";
import { getUser } from "~/utils/session.server";

type LoaderData = {
    user: User;
};

export const loader: LoaderFunction = async ({request}) => {
    const user = await getUser(request);

    const data: LoaderData = {
        user: user as User,
    };

    return data;
};

export default function ProfileEditRoute() {
    const data = useLoaderData<LoaderData>();

    return (
        <div>
            <h4>Change your password</h4>

            <Form>
                <label>
                    Current password: {" "}
                    <input type="password" placeholder="Your current password" />
                </label>

                <label>
                    New password: {" "}
                    <input 
                        type="password" 
                        placeholder="Add new password" />
                </label>

                <label>
                    Repeat new password: {" "}
                    <input 
                        type="password" 
                        placeholder="Repeat new password" />
                </label>

                <button type="submit" className="button">Change your password</button>
            </Form>
        </div>
    );
}
