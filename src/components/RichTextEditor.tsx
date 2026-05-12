import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
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
  placeholder,
  minHeight = 150,
  toolbar = TOOLBAR_BASIC,
}: RichTextEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Stable ref so the text-change handler never closes over a stale onChange.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

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
