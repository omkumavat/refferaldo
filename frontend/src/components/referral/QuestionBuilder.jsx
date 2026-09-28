import React from "react";
import {
  Plus,
  GripVertical,
  HelpCircle,
} from "lucide-react";

import { QuestionItem } from "./QuestionItem";

export const QuestionBuilder = ({
  questions,
  onAdd,
  onUpdate,
  onDelete,
  onMove,
}) => {
  const addCustomQuestion = () => {
    onAdd({
      question: "",
      type: "text",
      required: false,
      placeholder: "",
      options: [],
    });
  };

  return (
    <section className="card p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Candidate questions
            </h2>

            <p className="text-sm text-slate-500 mt-0.5">
              Ask only what you actually need to evaluate the candidate.
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-400">
          {questions.length} questions
        </span>
      </div>

      <div className="space-y-3 mt-6">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="flex gap-2"
          >
            <div className="hidden sm:flex pt-4 text-slate-300">
              <GripVertical className="w-4 h-4" />
            </div>

            <div className="flex-1">
              <QuestionItem
                question={question}
                index={index}
                total={questions.length}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onMove={onMove}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addCustomQuestion}
        className="w-full mt-5 py-3 border border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-600 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50/50 transition"
      >
        <Plus className="w-4 h-4 inline mr-1.5" />
        Add custom question
      </button>
    </section>
  );
};