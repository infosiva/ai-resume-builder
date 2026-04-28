"use client";

interface Props {
  resume: string | null;
  loading: boolean;
}

export default function ResumePreview({ resume, loading }: Props) {
  function handleDownload() {
    if (!resume) return;
    const blob = new Blob([resume], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.md";
    a.click();
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-1">Preview</h2>
          <p className="text-sm text-white/40">AI-generated resume</p>
        </div>
        {resume && (
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium transition-all"
          >
            Download
          </button>
        )}
      </div>

      <div className="flex-1 rounded-xl border border-white/5 bg-black/30 p-6 min-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
            <p className="text-sm text-white/40">Crafting your resume...</p>
          </div>
        ) : resume ? (
          <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono leading-relaxed">{resume}</pre>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl">✦</div>
            <p className="text-white/40 text-sm max-w-xs">
              Fill in your details and click generate — your tailored resume will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
