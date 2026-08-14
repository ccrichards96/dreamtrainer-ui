import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
  placeholder?: string;
  minHeight?: number;
  toolbar?: unknown[];
}

export const TOOLBAR_BASIC = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link"],
  ["clean"],
];

export const TOOLBAR_FULL = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ color: [] }, { background: [] }],
  ["link"],
  ["clean"],
];

export const TOOLBAR_WITH_IMAGE = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ color: [] }, { background: [] }],
  ["link", "image"],
  ["clean"],
];

export default function RichTextEditor({
  value,
  onChange,
  onImageUpload,
  placeholder,
  minHeight = 150,
  toolbar = TOOLBAR_BASIC,
}: RichTextEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Stable refs so event handlers never close over stale props.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const onImageUploadRef = useRef(onImageUpload);
  onImageUploadRef.current = onImageUpload;

  useEffect(() => {
    const wrapper = containerRef.current;
    if (!wrapper) return;

    // Quill inserts its toolbar as a DOM sibling BEFORE the element passed to
    // new Quill(). To keep cleanup simple we give it a fresh inner div so the
    // toolbar lands inside our stable wrapper ref, not outside it.
    const editorEl = document.createElement("div");
    wrapper.appendChild(editorEl);

    const quill = new Quill(editorEl, {
      theme: "snow",
      placeholder,
      modules: {
        toolbar: {
          container: toolbar,
          handlers: {
            link: (active: boolean) => {
              if (active) {
                const url = window.prompt("Enter URL:");
                if (url) {
                  const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
                  quill.format("link", normalized);
                }
              } else {
                quill.format("link", false);
              }
            },
            image: () => {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute(
                "accept",
                "image/jpeg, image/png, image/webp, image/gif, image/svg+xml"
              );
              input.click();

              input.onchange = async () => {
                const file = input.files?.[0];
                if (!file) return;

                if (onImageUploadRef.current) {
                  try {
                    const imageUrl = await onImageUploadRef.current(file);
                    const range = quill.getSelection(true) || { index: quill.getLength() };
                    quill.insertEmbed(range.index, "image", imageUrl);
                    quill.setSelection(range.index + 1);
                  } catch (err: any) {
                    console.error("Failed to upload image:", err);
                    alert(err.message || "Image upload failed. Please try again.");
                  }
                } else {
                  // Fallback: default FileReader base64 embedding if no upload handler provided
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const base64Url = e.target?.result as string;
                    if (base64Url) {
                      const range = quill.getSelection(true) || { index: quill.getLength() };
                      quill.insertEmbed(range.index, "image", base64Url);
                      quill.setSelection(range.index + 1);
                    }
                  };
                  reader.readAsDataURL(file);
                }
              };
            },
          },
        },
      },
    });

    // The snow theme's SELECTION_CHANGE listener shows a tooltip whenever the
    // cursor lands on a link. That tooltip has <a class="ql-preview" href="null">
    // which navigates to /null on click. We use window.prompt for all link
    // editing, so suppress the tooltip entirely.
    const tooltip = (quill as unknown as { theme: { tooltip?: { show: () => void } } }).theme
      ?.tooltip;
    if (tooltip) {
      tooltip.show = () => {};
    }

    if (value) {
      quill.clipboard.dangerouslyPasteHTML(value);
    }

    quill.on("text-change", () => {
      onChangeRef.current(quill.root.innerHTML);
    });

    return () => {
      quill.off("text-change");
      // Remove the toolbar Quill inserted before editorEl, then editorEl itself.
      editorEl.previousElementSibling?.remove();
      editorEl.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="[&_.ql-editor_a]:text-blue-600 [&_.ql-editor_a]:underline"
      style={{ minHeight: `${minHeight}px`, backgroundColor: "white" }}
    />
  );
}

