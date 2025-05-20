"use server";

export default async function UnauthorizedPage({message}:{message:string}) {
    return (
        <div className="items-center text-center justify-center">
            <h1 className={"text-3xl"}>Unauthorized :(</h1>
            <p>You're seeing this message because you appear to be accessing a resource that you're not authorized to.</p>
            <p>{message}</p>
        </div>
    )
}
