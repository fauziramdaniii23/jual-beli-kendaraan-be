import type { ImgHTMLAttributes } from "react";

type AppLogoIconProps = ImgHTMLAttributes<HTMLImageElement>

export default function AppLogoIcon(
    props: AppLogoIconProps
) {
    return (
        <img
            src="/assets/img/logo1.png"
            alt="Logo"
            {...props}
        />
    );
}
