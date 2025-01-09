import { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css"; // Import Quill styles
import Quill from "quill";

const QuillEditor = ({ setContent, initialContent = ""  }) => {
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  useEffect(() => {
    if (initialContent) {
      // Set the initial content when the component mounts
      setContent(initialContent);
    }
  }, [initialContent, setContent]);

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write your content here...",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ font: [] }], // Font styles including size
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
          ],
        },
      });

      quillInstance.current.on("text-change", () => {
        setContent(quillInstance.current.root.innerHTML); // Set content as HTML
      });
    }
  }, [setContent]);

  return (
    <div
      ref={editorRef}
      theme="snow"
      className="h-40 border border-gray-300 rounded-md"
      style={{ height: "450px", width: "100%", fontSize: "1rem" }}
    ></div>
  );
};

export default QuillEditor;
