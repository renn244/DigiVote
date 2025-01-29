import { ArrowLeft } from "lucide-react"
import React, { ComponentProps, PropsWithChildren } from "react"
import { Link } from "react-router"
import { Button } from "../ui/button"

type GoBackButtonProps = {
    icon?: React.ReactNode,
    to: string,
    reload?: boolean,
} & PropsWithChildren & ComponentProps<typeof Button>

const GoBackButton = ({
    icon,
    to,
    children,
    reload=false,
    ...props
}: GoBackButtonProps) => {

    return (
        <Button {...props} variant={'outline'} asChild>
            <Link reloadDocument={reload} to={to}>
                {icon ? (
                    <div className="h-4 w-4 mr-2">
                        {icon}
                    </div>
                ) : (
                    <ArrowLeft className="h-4 w-4 mr-2" />
                )} {children}
            </Link>
        </Button>
    )
}

export default GoBackButton