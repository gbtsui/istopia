"use server";

export default async function UnknownUserPage() {
    return (
        <div className={"text-center"}>
            <h1 className={"text-3xl"}>404</h1>
            <h2>looks like this user doesn't exist!</h2>
        </div>
    )
}