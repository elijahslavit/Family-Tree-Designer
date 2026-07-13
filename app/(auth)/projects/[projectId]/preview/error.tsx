"use client";

export default function PilotPreviewError({ reset }: { reset: () => void }) {
  return <div className="grid min-h-[70vh] place-items-center bg-[#f8f4ea] px-4"><div className="max-w-md text-center"><h1 className="font-serif text-3xl font-semibold">The preview could not be opened.</h1><p className="mt-3 text-sm leading-6 text-[#665e52]">The project data remains private. Retry this preview or return to the project workspace.</p><button type="button" onClick={reset} className="mt-5 rounded-full bg-[#293a31] px-5 py-3 text-sm font-semibold text-white">Retry preview</button></div></div>;
}
