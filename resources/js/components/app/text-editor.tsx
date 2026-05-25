import Quill from "quill";
import { useEffect, useRef } from "react";

import "quill/dist/quill.snow.css";

type Props = {
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
};

export default function TextEditor({
   value = "",
   onChange,
    disabled,
}: Props) {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const quillRef = useRef<Quill | null>(null);

    useEffect(() => {
        if (!editorRef.current || quillRef.current) {
            return;
        }

        const quill = new Quill(editorRef.current, {
            theme: "snow",

            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link"],
                    ["clean"],
                ],
            },
        });

        quill.root.innerHTML = value;

        quill.on("text-change", () => {
            onChange?.(quill.root.innerHTML);
        });

        quillRef.current = quill;
    }, []);

    useEffect(() => {
        if (!quillRef.current) {
            return
        }

        if (disabled) {
            quillRef.current.enable(false);
        } else {
            quillRef.current.enable(true);
        }
    }, [disabled]);

    return (
        <div className="rounded-md overflow-hidden">
            <div ref={editorRef} />
        </div>
    );
}
