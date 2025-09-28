import React from "react";
import { Download, Eye, CheckCircle, RefreshCw, XCircle } from "lucide-react";

const statusColors = {
  submitted: "bg-yellow-500 text-black",
  revision_requested: "bg-red-500 text-white",
  accepted: "bg-green-500 text-white",
};

function DeliverableCard({
  deliverable,
  role,
  milestones = [],
  onAccept,
  onRequestRevision,
  onDownload,
  onResubmit,
}) {
  const {
    file_url,
    preview_url,
    notes,
    status,
    created_at,
    hash,
    milestone_id,
  } = deliverable;

  // Find the milestone for this deliverable
  const milestone = milestones.find((m) => m.id === milestone_id);

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 mb-4 flex flex-col md:flex-row md:items-center gap-4">
      {/* Preview */}
      <div className="flex-shrink-0">
        {preview_url ? (
          <a href={preview_url} target="_blank" rel="noopener noreferrer">
            <img
              src={preview_url}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-md border border-neutral-800"
            />
          </a>
        ) : (
          <div className="w-24 h-24 flex items-center justify-center bg-neutral-800 rounded-md text-neutral-400">
            <Eye className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
              statusColors[status] || "bg-neutral-700 text-white"
            }`}
          >
            {status}
          </span>
          <span className="text-xs text-neutral-400">
            {new Date(created_at).toLocaleString()}
          </span>
          {milestone && (
            <span className="ml-2 px-2 py-0.5 rounded bg-neutral-800 text-cyan-400 text-xs font-semibold">
              {milestone.title}
            </span>
          )}
        </div>
        <div className="font-medium text-white truncate">
          {file_url ? (
            <a
              href={status === "accepted" ? file_url : preview_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {file_url.split("/").pop()}
            </a>
          ) : (
            <span className="text-neutral-400">No file</span>
          )}
        </div>
        {notes && (
          <div className="text-neutral-300 text-sm mt-1 whitespace-pre-line">
            {notes}
          </div>
        )}
        {/* (Optional) Show hash for admin/debug */}
        {/* <div className="text-xs text-neutral-500 mt-1">Hash: {hash}</div> */}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 items-end">
        {/* Download button (only if accepted) */}
        {status === "accepted" && file_url && (
          <a
            href={file_url}
            download
            className="inline-flex items-center gap-1 px-3 py-1 rounded bg-cyan-400 text-black font-semibold text-sm hover:bg-cyan-300 transition"
          >
            <Download className="w-4 h-4" /> Download
          </a>
        )}

        {/* Client actions */}
        {role === "client" && status === "submitted" && (
          <>
            <button
              onClick={onAccept}
              className="inline-flex items-center gap-1 px-3 py-1 rounded bg-green-500 text-white font-semibold text-sm hover:bg-green-600 transition"
            >
              <CheckCircle className="w-4 h-4" /> Accept
            </button>
            <button
              onClick={onRequestRevision}
              className="inline-flex items-center gap-1 px-3 py-1 rounded bg-yellow-500 text-black font-semibold text-sm hover:bg-yellow-400 transition"
            >
              <RefreshCw className="w-4 h-4" /> Request Revision
            </button>
          </>
        )}

        {/* Freelancer actions */}
        {role === "freelancer" && status === "revision_requested" && (
          <button
            onClick={onResubmit}
            className="inline-flex items-center gap-1 px-3 py-1 rounded bg-cyan-400 text-black font-semibold text-sm hover:bg-cyan-300 transition"
          >
            <RefreshCw className="w-4 h-4" /> Resubmit
          </button>
        )}

        {/* Show rejected badge if rejected */}
        {status === "rejected" && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded bg-red-500 text-white font-semibold text-sm">
            <XCircle className="w-4 h-4" /> Rejected
          </span>
        )}
      </div>
    </div>
  );
}

export default DeliverableCard;