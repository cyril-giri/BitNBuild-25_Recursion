import React, { useState } from "react";
import DeliverableCard from "./DeliverableCard";
import SubmitDeliverableModal from "../Deliverables/SubmitDeliverableModal";

/**
 * DeliverablesList
 * 
 * Props:
 * - deliverables: array of deliverable objects
 * - role: "client" | "freelancer"
 * - onAccept: function(deliverable)
 * - onRequestRevision: function(deliverable)
 * - onResubmit: function(deliverable)
 * - onSubmitDeliverable: function(formData)
 * - loading: boolean (for submit button)
 */
const DeliverablesList = ({
  deliverables = [],
  role,
  onAccept,
  onRequestRevision,
  onResubmit,
  onSubmitDeliverable,
  loading,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      {/* Add Deliverable Button (for freelancer) */}
      {role === "freelancer" && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="bg-cyan-400 text-black px-4 py-2 rounded font-semibold hover:bg-cyan-300 transition"
          >
            + Add Deliverable
          </button>
        </div>
      )}

      {/* Modal for submitting deliverable */}
      {showModal && (
        <SubmitDeliverableModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={onSubmitDeliverable}
          loading={loading}
        />
      )}

      {/* Deliverables List */}
      <div>
        {deliverables.length === 0 ? (
          <div className="text-neutral-400 text-center py-12">
            {role === "freelancer"
              ? "No deliverables submitted yet. Upload your first deliverable."
              : "Waiting for freelancer to submit deliverables."}
          </div>
        ) : (
          deliverables.map((d) => (
            <DeliverableCard
              key={d.id}
              deliverable={d}
              role={role}
              onAccept={() => onAccept && onAccept(d)}
              onRequestRevision={() => onRequestRevision && onRequestRevision(d)}
              onResubmit={() => onResubmit && onResubmit(d)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default DeliverablesList;