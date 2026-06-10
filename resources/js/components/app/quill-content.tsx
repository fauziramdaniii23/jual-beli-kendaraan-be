import DOMPurify from "isomorphic-dompurify";
import { cn } from "@/lib/utils";

interface QuillContentProps {
    content?: string | null;
    className?: string;
    clamp?: number;
}

export default function QuillContent({content, className,clamp}: QuillContentProps) {

    if (!content) {
        return null;
    }

    return (
        <div
            className={cn(
                "quill-content",
                clamp && `line-clamp-${clamp}`,
                className
            )}
            dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(content),
            }}
        />
    );
}
