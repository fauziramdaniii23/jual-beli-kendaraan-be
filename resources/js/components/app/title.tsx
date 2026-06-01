type Props ={
    title: string
    description?: string
}
export default function Title ({ title, description }: Props) {
    return (
        <div className="mx-4 mt-4">
            <div className="text-xl font-semibold text-gray-800">{title}</div>
            <div className="text-sm text-gray-500">{description}</div>
        </div>
    )
}
