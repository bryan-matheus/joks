export function validateCurrentPassword(password: string) {
    if (password.length < 8) {
        return `That password is too short`;
    }
}

export function validateRepeatPassword(password: string, repeatPassword: string) {
    if (password !== repeatPassword) {
        return `Passwords do not match`;
    }
}

export function validateNewPassword(password: string) {
    if (password.length < 8) {
        return `That password is too short`;
    }

    if (password.length > 255) {
        return `That password is too long`;
    }
}
