"use client"

//ok so basically we need a signup flow which is like
//idk
//email
//username
//display name (optional)
//password
//then it sends an email with a code to the email to confirm the account
//and then *only then* does it actually make the user

import GetUserSession from "@/app/api/data/user-management/get-user-session";
import {redirect} from "next/navigation";
import ParticleBackdrop from "@/app/engine/engine-components/particle-backdrop";
import {useCallback, useEffect, useState} from "react";
import CreateUser from "@/app/api/data/user-management/create-user";
import {signIn} from "next-auth/react";
import {SendConfirmationEmail} from "@/app/api/send/send-confirmation-email";

export default function SignUpPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    //const [canResend, setCanResend] = useState(false);
    const [timeToNextResend, setTimeToNextResend] = useState(0);

    useEffect(() => {
        const init = async () => {
            const user = await GetUserSession();
            if (user) {
                redirect("/dashboard")
            }
            setLoading(false)
        }
        init()
    }, [])

    useEffect(() => {
        console.log("useEffect called")
        if (timeToNextResend === 0) {
            console.log("time = 0")
            return;
        }

        console.log("okay well we got this far")

        const interval = setInterval(() => {
            setTimeToNextResend((prevState) => prevState - 1);
            console.log("interval called")
        }, 1000)

        return clearInterval(interval)

    }, [timeToNextResend])


    const sign_up = useCallback((formData: FormData) => {
        const signup = async () => {
            setLoading(true);
            const result = await CreateUser({
                name: formData.get("username") as string,
                display_name: formData.get("display_name") as string ?? formData.get("username") as string,
                email: formData.get("email") as string,
                password: formData.get("password") as string,
                code: formData.get("code") as string,
            })
            if (!result.success) {
                setError(result.error)
            } else {
                const signInResult = await signIn("credentials", {
                    identifier: formData.get("email"),
                    password: formData.get("password"),
                    redirect: false
                })
                if (signInResult?.error) {
                    setError(signInResult?.error)
                    setLoading(false);
                } else {
                    redirect("/dashboard")
                }
            }
        }
        signup().then(() => console.log("sign up complete"))
    }, [])

    const send_code = useCallback(async () => {
        console.log("send_code triggered")
        if (email) {
            await SendConfirmationEmail(email)
            setTimeToNextResend(5)
        }
    }, [email, SendConfirmationEmail, setTimeToNextResend])

    if (loading) return <div>loading...</div>;
    //need to actually provide user feedback on input validity and stuff
    //not in minimum viable product though
    return (
        <div className={"flex relative items-center justify-center"}>
            <ParticleBackdrop id={"tsparticlespmo"}/>
            <div
                className={"bg-gray-700 border-gray-50 m-4 p-10 rounded-2xl w-1/2 flex flex-col gap-6 items-center opacity-80"}>
                <form className={"flex flex-col items-center"} action={sign_up}>
                    <div>
                        <label>what shall identify you?</label><br/>
                        <input type="text" name={"username"}
                               className={"bg-gray-600 text-white outline-0 disabled:text-gray-500 disabled:bg-gray-800 p-3 text-xl rounded-lg"}
                               placeholder={"username"} onChange={(e) => setUsername(e.target.value)} disabled={loading}
                               required/>
                    </div>
                    <div>
                        <label>what shall you be called?</label><br/>
                        <input type="text" name={"display_name"}
                               className={"bg-gray-600 text-white outline-0 disabled:text-gray-500 disabled:bg-gray-800 p-3 text-xl rounded-lg"}
                               placeholder={username ? username : "display name"}
                               disabled={loading}/>
                    </div>
                    <div>
                        <label>how will we reach you?</label><br/>
                        <input type="text" name={"email"}
                               className={"bg-gray-600 text-white outline-0 disabled:text-gray-500 disabled:bg-gray-800 p-3 text-xl rounded-lg"}
                               placeholder={"email"}
                               onChange={(e) => setEmail(e.target.value)}
                               disabled={loading} required/>
                    </div>
                    <div>
                        <label>set some secret words.</label><br/>
                        <input type="password" name={"password"}
                               className={"bg-gray-600 text-white outline-0 disabled:text-gray-500 disabled:bg-gray-800 p-3 text-xl rounded-lg"}
                               placeholder={"password"} disabled={loading} required/>
                    </div>

                    {email &&
                        <div>
                            <label>enter email confirmation code...</label><br/>
                            <button onClick={send_code} disabled={timeToNextResend>0} className={"underline disabled:text-gray-200 disabled:no-underline hover:cursor-pointer"} type={"button"}>{timeToNextResend>0? <p>wait {timeToNextResend} seconds to resend...</p>:<p>send code!</p> }</button><br/>
                            <input type={"text"} name={"confirmation"}
                                   className={"bg-gray-600 text-white outline-0 disabled:text-gray-500 disabled:bg-gray-800 p-3 text-xl rounded-lg"}
                                   placeholder={"123abc"} disabled={loading} required/>
                        </div>
                    }

                    <div>
                        <button className={"p-3 bg-black rounded-xl my-2"}>submit</button>
                    </div>
                    {error &&
                        <div className={"bg-red-400"}>
                            <h3 className={"text-2xl"}>error!</h3>
                            <p>{error}</p>
                        </div>
                    }
                </form>
            </div>
        </div>
    )
    //okay you really need to make an email verification system
}