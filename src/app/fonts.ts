import localFont from "next/font/local";

export const newRocker = localFont({
    src: [
        {
            path: "../../public/fonts/NewRocker-Regular.ttf",
            weight: "400",
            style: "normal",
        },
    ],
    variable: "--font-new-rocker",
    display: "swap",
});
