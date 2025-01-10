import { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";
import Quill from "quill";

const MAX_FILE_SIZE = 1000000; // 1MB limit
const ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/gif"];

const QuillEditor = ({ setContent, initialContent = "" }) => {
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];

      // Validate file type
      if (!ALLOWED_FORMATS.includes(file.type)) {
        alert("Please upload only images (JPEG, PNG, GIF)");
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        alert("Image size should be less than 1MB");
        return;
      }

      try {
        // Convert to base64
        const reader = new FileReader();
        reader.onload = () => {
          const range = quillInstance.current.getSelection(true);
          quillInstance.current.insertEmbed(
            range.index,
            "image",
            reader.result
          );
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      }
    };
  };

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent, setContent]);

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write your content here...",
        modules: {
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"],
              [{ font: [] }],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link"],
              ["image"],
            ],
            handlers: {
              image: imageHandler,
            },
          },
        },
      });

      quillInstance.current.on("text-change", () => {
        const content = quillInstance.current.root.innerHTML;
        // Remove base64 images larger than limit
        const processedContent = content.replace(
          /data:image\/[^;]+;base64[^"]+/g,
          (match) => {
            if (match.length > MAX_FILE_SIZE * 1.37) {
              // base64 is ~1.37x larger
              return "";
            }
            return match;
          }
        );
        setContent(processedContent);
      });
    }
  }, [setContent]);

  return (
    <div className="editor-container">
      <div
        ref={editorRef}
        className="h-40 border border-gray-300 rounded-md"
        style={{ height: "450px", width: "100%", fontSize: "1rem" }}
      />
      <div className="text-xs text-gray-500 mt-2">
        * Images must be less than 1MB in size
      </div>
    </div>
  );
};

export default QuillEditor;
