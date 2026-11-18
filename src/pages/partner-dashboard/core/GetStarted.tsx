import { Wand2 } from "lucide-react";

export default function GetStarted() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Get Started</h1>
      <p className="mt-1 text-sm text-gray-600">
        Everything you need to set up a successful partnership with Dream Trainer.
      </p>

      <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
          <Wand2 className="size-6" />
        </div>
        <p className="mt-1 max-w-sm text-sm text-gray-600">
          Onboarding checklist
        </p>
      </div>
    </div>
  );
}
