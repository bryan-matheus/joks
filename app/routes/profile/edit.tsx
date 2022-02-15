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
            <h4>Edit your profile</h4>

            <Form>
                <label>
                    Username: {" "}
                    <input 
                        type="text"
                        disabled={true}
                        value={data.user.username} />
                </label>

                <label>
                    Real Name: {" "}
                    <input 
                        type="text" 
                        placeholder="Your real name"
                        value={data.user?.realName ?? undefined} />
                </label>

                <label>
                    Bio: {" "}
                    <textarea
                        rows={3}
                        placeholder="Tell us about yourself"
                        value={data.user?.bio ?? undefined}/>
                </label>

                <button type="submit" className="button">Update profile</button>
            </Form>
        </div>
    );
}
