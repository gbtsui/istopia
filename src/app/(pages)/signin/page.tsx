"use client";

import Typewriter from "@/app/engine/engine-components/typewriter";
import {useEffect, useState} from "react";
import {signIn} from "next-auth/react";
import {redirect} from "next/navigation";
import ParticleBackdrop from "@/app/engine/engine-components/particle-backdrop";
import GetUserSession from "@/app/api/data/user-management/get-user-session";

const SignInPoem = [
    "I see someone.",
    "Someone new?",
    "Or someone returning?",
    "If they are new, then maybe this isn't the right page for them.",
    "But if they've been here before, then I have the pleasure of meeting them again.",
    "...",
    "I do hope that they've remembered their password.",
]

export default function SigninPage() {
    const [error, setError] = useState<Error|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

    useEffect(() => {
        const init = async () => {
            const user = await GetUserSession()
            if (user) {
                redirect("/dashboard")
            }
        }
        init()
    }, []);

    function login(form_data: FormData){
        const getResult = async ()=> {
            setLoading(true);
            setButtonDisabled(true);
            const result = await signIn("credentials", {
                identifier: form_data.get("identifier"),
                password: form_data.get("password"),
                redirect: false
            });

            if (result?.error) {
                (result.error == "CredentialsSignin") ? setError(new Error("i don't recognize those words. try again.")) : setError(new Error(result?.error))
                setLoading(false);
                setButtonDisabled(false);
            } else {
                redirect("/u/gbtsui") // TODO: change this later vro
            }
        }
        getResult();
    }

    return (
        <div className={"flex relative"}>
            <ParticleBackdrop id={"tsparticlespmo"}/>
            <div className={"px-6 py-10 text-gray-500 w-1/2"}>
                <Typewriter props={{content: SignInPoem, lineDelay: 3000, className: "bg-gray-800 opacity-80 p-4 rounded-xl transition-all text-green-500"}}/>
            </div>
            <div className={"bg-gray-700 border-gray-50 m-4 p-10 rounded-2xl w-1/2 flex flex-col gap-6 items-center opacity-80"}>
                <h1 className={"text-4xl"}>welcome back.</h1>
                <h2 className={"text-2xl"}>sign in here.</h2>
                <form className={"flex flex-col items-center"} action={login}>
                    <div>
                        <label>user, state your name. or your email.</label><br/>
                        <input type="text" name={"identifier"} className={"bg-gray-600 text-white outline-0 disabled:text-gray-500 disabled:bg-gray-800 p-3 text-xl rounded-lg"}
                               placeholder={"you@istopia.gbtsui.dev"} disabled={loading} required/>
                    </div>
                    <div>
                        <label>and the secret words?</label><br/>
                        <input type={"password"} name="password" className={"bg-gray-600 text-white outline-0 disabled:text-gray-500 disabled:bg-gray-800 p-3 text-xl rounded-lg"}
                               placeholder={"supersecretpassword"} disabled={loading} required/>
                    </div>
                    <div>
                        <input type={"submit"} value={loading? "signing in...":"sign in"} className={"bg-gray-600 hover:bg-black transition-colors text-white outline-0 disabled:text-gray-500 disabled:hover:bg-gray-400 disabled:hover:cursor-not-allowed p-3 text-xl rounded-lg m-3"} disabled={buttonDisabled}/>
                    </div>

                </form>
                <label className={"text-red-500"}>{error ? <p>Error: {error.message}</p>:null}</label>
            </div>
        </div>
    )
}