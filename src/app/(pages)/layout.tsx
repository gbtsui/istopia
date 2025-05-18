import {ReactNode} from "react";
import Navbar from "@/app/component/universal/navbar";

export default function Layout({children}: Readonly<{children: ReactNode}>){
    return (
        <>
        <Navbar/>
            {children}
        </>
    )
}