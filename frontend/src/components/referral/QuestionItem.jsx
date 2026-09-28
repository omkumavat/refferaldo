import React from "react";
import {
  Trash2,
  ChevronUp,
  ChevronDown,
  Plus,
  X,
} from "lucide-react";

export const QuestionItem = ({
  question,
  index,
  total,
  onUpdate,
  onDelete,
  onMove,
}) => {
  const update = (field, value) => {
    onUpdate(question.id, {
      [field]: value,
    });
  };

  const addOption = () => {
    update("options", [
      ...(question.options || []),
      `Option ${(question.options?.length || 0) + 1}`,
    ]);
  };

  const updateOption = (index, value) => {
    const options = [...(question.options || [])];

    options[index] = value;

    update("options", options);
  };

  const removeOption = (index) => {
    update(
      "options",
      question.options.filter(
        (_, i) => i !== index
      )
    );
  };

  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-white hover:border-slate-300 transition">
      {/* Top */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Question {index + 1}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(index, -1)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => onMove(index, 1)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(question.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Question */}
      <div className="space-y-4">
        <div>
          <label className="form-label">
            Question
          </label>

          <input
            value={question.question}
            onChange={(e) =>
              update("question", e.target.value)
            }
            placeholder="e.g. Why are you interested in this role?"
            className="form-input"
          />
        </div>

        {/* Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">
              Answer type
            </label>

            <select
              value={question.type}
              onChange={(e) =>
                update("type", e.target.value)
              }
              className="form-input"
            >
              <option value="text">Short text</option>
              <option value="textarea">Long answer</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="number">Number</option>
              <option value="radio">Single choice</option>
              <option value="checkbox">Multiple choice</option>
              <option value="select">Dropdown</option>
              <option value="url">URL</option>
              <option value="file">File upload</option>
            </select>
          </div>

          <div>
            <label className="form-label">
              Placeholder
            </label>

            <input
              value={question.placeholder || ""}
              onChange={(e) =>
                update(
                  "placeholder",
                  e.target.value
                )
              }
              placeholder="Optional"
              className="form-input"
            />
          </div>
        </div>

        {/* Options */}
        {["radio", "checkbox", "select"].includes(
          question.type
        ) && (
          <div>
            <label className="form-label">
              Options
            </label>

            <div className="space-y-2">
              {(question.options || []).map(
                (option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="flex gap-2"
                  >
                    <input
                      value={option}
                      onChange={(e) =>
                        updateOption(
                          optionIndex,
                          e.target.value
                        )
                      }
                      className="form-input"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeOption(optionIndex)
                      }
                      className="px-2 text-slate-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )
              )}
            </div>

            <button
              type="button"
              onClick={addOption}
              className="mt-2 text-xs font-medium text-emerald-700 hover:text-emerald-800"
            >
              <Plus className="w-3.5 h-3.5 inline mr-1" />
              Add option
            </button>
          </div>
        )}

        {/* Required */}
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={question.required}
            onChange={(e) =>
              update(
                "required",
                e.target.checked
              )
            }
            className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />

          <span className="text-sm text-slate-600">
            Required question
          </span>
        </label>
      </div>
    </div>
  );
};