import type {Metadata} from "next";
import "./globals.css";
import "./globalicons.css"
import {EB_Garamond, IBM_Plex_Mono, IBM_Plex_Sans} from "next/font/google";

const ebGaramond = EB_Garamond({
    variable: "--font-eb-garamond",
    subsets: ["latin"]
})

const ibmPlexSans = IBM_Plex_Sans({
    variable: "--font-ibm-plex-sans",
    subsets: ["latin"],
    weight: "300"
})

const ibmPlexMono = IBM_Plex_Mono({
    variable: "--font-ibm-plex-mono",
    subsets: ["latin"],
    weight: "300"
})

export const metadata: Metadata = {
    title: "Istopia",
    description: "by gbtsui",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <title>istopia</title>
            <script defer data-domain="istopia.gbtsui.dev" src="https://plausible.io/js/script.js"></script>
        </head>
        <body
            className={`${ebGaramond.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} antialiased`}
        >
        {children}
        </body>
        </html>
    );
}
