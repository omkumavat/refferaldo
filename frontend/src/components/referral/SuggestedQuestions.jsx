import React from "react";
import { Plus, Sparkles } from "lucide-react";
import { suggestedQuestions } from "../../data/referralQuestions";

export const SuggestedQuestions = ({
  questions,
  onAdd,
}) => {
  const isAdded = (suggested) => {
    return questions.some(
      (question) =>
        question.question === suggested.question
    );
  };

  return (
    <section className="card p-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
          <Sparkles className="w-5 h-5" />
        </div>

        <div>
          <h2 className="font-semibold text-slate-900">
            Suggested questions
          </h2>

          <p className="text-sm text-slate-500 mt-0.5">
            Add common questions with one click.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-5">
        {suggestedQuestions.map((item) => {
          const added = isAdded(item);

          return (
            <button
              key={item.id}
              type="button"
              disabled={added}
              onClick={() => onAdd(item)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition ${
                added
                  ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-white border-slate-200 text-slate-700 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};