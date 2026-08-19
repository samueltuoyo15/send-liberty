"use client";
import { useState, useRef, useEffect } from "react";

const LANG_LABELS: Record<string, string> = {
  curl: "cURL",
  js: "JavaScript",
  python: "Python",
  go: "Go",
  rust: "Rust",
  php: "PHP",
  net: ".NET",
  java: "Java"
};

export function EditableCodeBlock({ 
  snippets,
  title
}: { 
  snippets: Record<string, string>;
  title?: string;
}) {
  const availableLangs = Object.keys(snippets);
  const [lang, setLang] = useState<string>(availableLangs[0]);
  const [isCopied, setIsCopied] = useState(false);
  
  const preRef = useRef<HTMLPreElement>(null);
  const [editedSnippets, setEditedSnippets] = useState<Record<string, string>>({});

  useEffect(() => {
    if (preRef.current) {
      preRef.current.innerText = editedSnippets[lang] ?? snippets[lang] ?? "";
    }
  }, [lang, snippets, editedSnippets]);

  const handleInput = () => {
    if (preRef.current) {
      setEditedSnippets(prev => ({ ...prev, [lang]: preRef.current!.innerText }));
    }
  };

  const handleCopyCode = () => {
    const textToCopy = preRef.current?.innerText || "";
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {title && <h3 className="text-xl font-bold text-primary-sendlib mr-2">{title}</h3>}
          {availableLangs.length > 1 && (
            <div className="flex rounded-lg bg-surface border border-outline-variant p-1 text-xs font-mono overflow-x-auto max-w-full">
              {availableLangs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setLang(tab)}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    lang === tab ? "bg-primary-sendlib/10 text-primary-sendlib font-bold" : "text-[#75777d] hover:text-primary-sendlib"
                  }`}
                >
                  {LANG_LABELS[tab] || tab}
                </button>
              ))}
            </div>
          )}
          {availableLangs.length === 1 && !title && (
             <code className="text-sm font-mono text-primary-sendlib bg-primary-sendlib/5 px-3 py-1 rounded-lg border border-primary-sendlib/20">
               {LANG_LABELS[lang] || lang}
             </code>
          )}
        </div>
        <button
          onClick={handleCopyCode}
          className="text-xs font-mono bg-surface border border-outline-variant hover:bg-surface-container-low text-primary-sendlib px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
        >
          {isCopied ? "✓ Copied" : "Copy Code"}
        </button>
      </div>

      <pre 
        ref={preRef}
        contentEditable 
        suppressContentEditableWarning 
        onBlur={handleInput}
        className="p-4 bg-surface-container-high border border-outline-variant/50 rounded-lg text-sm font-mono text-white/95 overflow-x-auto whitespace-pre leading-relaxed outline-none focus:border-primary-sendlib focus:ring-1 focus:ring-primary-sendlib/20 transition-all cursor-text"
      />
    </div>
  );
}
