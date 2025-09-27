import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../lib/useApi";
import { supabase } from "../lib/supabaseClient";
import ProjectCard from "../components/ProjectDetailPage/ProjectCard";
import BidList from "../components/ProjectDetailPage/BidList";
import {Button} from "../components/ui/button";
import LoggedInNavbar from "../components/LoggedInNavbar";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch project details
  const {
    data: project,
    loading: loadingProject,
    error: errorProject,
    refetch: refetchProject,
  } = useApi({
    fetchFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    deps: [id],
  });

  // Fetch bids for this project
  const {
    data: bids,
    loading: loadingBids,
    error: errorBids,
    refetch: refetchBids,
  } = useApi({
    fetchFn: async () => {
      const { data, error } = await supabase
        .from("bids")
        .select("*, profiles:freelancer_id(*)")
        .eq("project_id", id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    deps: [id],
  });

  // Accept bid handler
  const handleAcceptBid = async (bidId, freelancerId) => {
    // 1. Create contract
    const { error: contractError } = await supabase.from("contracts").insert([
      {
        project_id: id,
        client_id: project.client_id,
        freelancer_id: freelancerId,
        terms: "", // Add terms if needed
      },
    ]);
    if (contractError) {
      alert("Error creating contract: " + contractError.message);
      return;
    }

    // 2. Update bid statuses
    // const { error: updateBidsError } = await supabase.rpc("accept_bid_and_reject_others", {
    //   accepted_bid_id: bidId,
    //   project_id: id,
    // });
    //If you don't have a stored procedure, do it manually:
    await supabase.from("bids").update({ status: "accepted" }).eq("id", bidId);
    await supabase.from("bids").update({ status: "rejected" }).eq("project_id", id).neq("id", bidId);

    // 3. Update project status
    await supabase.from("projects").update({ status: "in_progress" }).eq("id", id);

    refetchBids();
    refetchProject();
  };

  // Cancel project handler
  const handleCancelProject = async () => {
    await supabase.from("projects").update({ status: "cancelled" }).eq("id", id);
    refetchProject();
    navigate("/dashboard");
  };

  if (loadingProject) return <div>Loading project...</div>;
  if (errorProject) return <div>Error loading project: {errorProject.message}</div>;
  if (!project) return <div className="text-neutral-400">Project not found.</div>;

  return (
    <>
      <LoggedInNavbar />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <ProjectCard project={project} />
        <div className="flex justify-between items-center mt-8 mb-4">
          <h2 className="text-2xl font-semibold text-white">Bids</h2>
          <Button variant="destructive" onClick={handleCancelProject}>
            Cancel Project
          </Button>
        </div>
        <BidList
          bids={bids || []}
          onAccept={handleAcceptBid}
          projectStatus={project.status}
        />
      </div>
    </>
  );
};

export default ProjectDetail;