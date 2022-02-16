import {
    ActionFunction,
    Form,
    json,
    Link,
    LoaderFunction,
    redirect,
    useActionData,
    useCatch,
    useTransition
} from "remix";
import { db } from "~/utils/db.server";
import { getUserId, requireUserId } from "~/utils/session.server";
import bcrypt from "bcryptjs";

type ActionData = {
    formError?: string;
    fieldErrors?: {
        currentPassword: string | undefined;
        newPassword: string | undefined;
        repeatNewPassword: string | undefined;
    };
    fields?: {
        currentPassword: string;
        newPassword: string;
        repeatNewPassword: string;
    };
};

export const loader: LoaderFunction = async ({ request }) => {
    const userId = await getUserId(request);

    if (!userId) {
        throw new Response("Unauthorized", { status: 401 });
    }

    return {};
};

const badRequest = (data: ActionData) => {
    return json(data, { status: 400 });
}

function validateCurrentPassword(password: string) {
    if (password.length < 8) {
        return `That password is too short`;
    }
}

function validateRepeatPassword(password: string, repeatPassword: string) {
    if (password !== repeatPassword) {
        return `Passwords do not match`;
    }
}
function validateNewPassword(password: string) {
    if (password.length < 8) {
        return `That password is too short`;
    }

    if (password.length > 255) {
        return `That password is too long`;
    }
}

export const action: ActionFunction = async ({ request }) => {
    const userId = await requireUserId(request);
    const form = await request.formData();
    const currentPassword = form.get("currentPassword");
    const repeatNewPassword = form.get("repeatNewPassword");
    const newPassword = form.get("newPassword");

    const currentUser = await db.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (
        typeof currentPassword !== "string" ||
        typeof repeatNewPassword !== "string" ||
        typeof newPassword !== "string"
    ) {
        return badRequest({
            formError: `Form not submitted correctly.`
        });
    }

    const fieldErrors = {
        currentPassword: validateCurrentPassword(currentPassword),
        repeatNewPassword: validateRepeatPassword(newPassword, repeatNewPassword),
        newPassword: validateNewPassword(newPassword),
    };

    const comparedPassword = await bcrypt.compare(currentPassword, currentUser?.passwordHash as string);

    if (!comparedPassword) {
        fieldErrors.currentPassword = "Incorrect password";
    }

    const fields = { currentPassword, repeatNewPassword, newPassword };

    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({ fieldErrors, fields });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    const user = await db.user.update({
        data: { passwordHash },
        where: { id: userId },
    });

    if (!user) {
        return badRequest({
            formError: `Could not update password.`,
        });
    }

    return redirect("/profile");
};

export default function ProfileEditRoute() {
    const actionData = useActionData<ActionData>();
    const transition = useTransition();

    return (
        <div>
            <h4>Change your password</h4>

            <Form method="patch">
                <div>
                    <label>
                        Current password: {" "}
                        <input
                            type="password"
                            name="currentPassword"
                            placeholder="Your current password"
                            value={actionData?.fields?.currentPassword}
                            defaultValue={actionData?.fields?.currentPassword}
                            aria-invalid={
                                Boolean(actionData?.fieldErrors?.currentPassword) ||
                                undefined
                            }
                            aria-describedby={
                                actionData?.fieldErrors?.currentPassword
                                    ? "new-password-error"
                                    : undefined
                            } />
                    </label>
                    {actionData?.fieldErrors?.currentPassword ? (
                        <p className="form-validation-error"
                            role="alert"
                            id="current-password-error">
                            {actionData.fieldErrors.currentPassword}
                        </p>
                    ) : null}
                </div>

                <div>
                    <label>
                        New password: {" "}
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="Add new password"
                            value={actionData?.fields?.newPassword}
                            defaultValue={actionData?.fields?.newPassword}
                            aria-invalid={
                                Boolean(actionData?.fieldErrors?.newPassword) ||
                                undefined
                            }
                            aria-describedby={
                                actionData?.fieldErrors?.newPassword
                                    ? "new-password-error"
                                    : undefined
                            } />
                    </label>
                    {actionData?.fieldErrors?.newPassword ? (
                        <p className="form-validation-error"
                            role="alert"
                            id="new-password-error">
                            {actionData.fieldErrors.newPassword}
                        </p>
                    ) : null}
                </div>

                <div>
                    <label>
                        Repeat new password: {" "}
                        <input type="password"
                            name="repeatNewPassword"
                            placeholder="Repeat new password"
                            value={actionData?.fields?.repeatNewPassword}
                            defaultValue={actionData?.fields?.repeatNewPassword}
                            aria-invalid={
                                Boolean(actionData?.fieldErrors?.repeatNewPassword) ||
                                undefined
                            }
                            aria-describedby={
                                actionData?.fieldErrors?.repeatNewPassword
                                    ? "repeat-new-password-error"
                                    : undefined
                            } />
                    </label>
                    {actionData?.fieldErrors?.repeatNewPassword ? (
                        <p className="form-validation-error"
                            role="alert"
                            id="repeat-new-password-error">
                            {actionData.fieldErrors.repeatNewPassword}
                        </p>
                    ) : null}
                </div>

                <button type="submit" className="button">
                    {transition.state === "submitting" ? "Changing your password..." : "Change password"}
                </button>
            </Form>
        </div>
    );
}

export function CatchBoundary() {
    const caught = useCatch();

    if (caught.status === 401) {
        return (
            <div className="error-container">
                <p>You must be logged in to edit profile.</p>
                <Link to="/login">Login</Link>
            </div>
        );
    }
}

export function ErrorBoundary({ error }: { error: Error }) {
    console.error(error);

    return (
        <div className="error-container">
            Something unexpected went wrong. Sorry about that.
        </div>
    );
}
