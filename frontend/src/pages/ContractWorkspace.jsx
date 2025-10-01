import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import ContractOverview from "../components/Contracts/ContractOverview";
import ChatInterface from "../components/Chat/ChatInterface";
import LeaveReviewPrompt from "../components/Reviews/LeaveReviewPrompt";
import { useApi } from "../lib/useApi";
import MilestoneList from "../components/Milestones/MilstoneList";
import Tabs from "../components/Dashboard/Shared/Tabs";
import ConnectWalletButton from "../components/ui/ConnectWalletButton";
import { ethers } from "ethers";
import { deployEscrowContract } from "../lib/deployEscrowContract";
import EscrowMilestoneUSDC from "../lib/EscrowMilestoneUSDC.json";
import { usdcToSmallestUnit, dateToEndOfDayUnix } from "../lib/utils";

const USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

export default function ContractWorkspace() {
  const { id: contractId } = useParams();
  const { profile, role } = useAuth();
  const [activeTab, setActiveTab] = useState("Milestones");
  const [deploying, setDeploying] = useState(false);
  const [setupStatus, setSetupStatus] = useState("");

  const { data, loading, error, refetch } = useApi({
    fetchFn: async () => {
      const { data: contractData, error: contractError } = await supabase
        .from("contracts")
        .select("*, project:projects(*), client:profiles!contracts_client_id_fkey(*), freelancer:profiles!contracts_freelancer_id_fkey(*)")
        .eq("id", contractId)
        .single();
      if (contractError) throw contractError;

      const { data: milestonesData, error: milestonesError } = await supabase
        .from("milestones")
        .select("*, escrow(*), deliverables(*)")
        .eq("contract_id", contractId)
        .order("order_no");
      if (milestonesError) throw milestonesError;

      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("*")
        .eq("contract_id", contractId);
      if (reviewsError) throw reviewsError;

      return { contract: contractData, milestones: milestonesData, reviews: reviewsData };
    },
    deps: [contractId],
  });

  const { contract, milestones, reviews } = data || {};

  const handleCreateMilestone = async ({ title, description, amount, due_date }) => {
    if (!contract?.escrow_contract_address) {
      alert("Escrow contract not deployed yet.");
      return;
    }
    try {
      if (!window.ethereum) throw new Error("MetaMask not found");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(
        contract.escrow_contract_address,
        EscrowMilestoneUSDC.abi,
        signer
      );

      // Convert amount and deadline
      const amountSmallest = usdcToSmallestUnit(amount);
      const deadlineUnix = dateToEndOfDayUnix(due_date);
      const deadlineIso = new Date(deadlineUnix * 1000).toISOString();

      // 1. Call on-chain createMilestone
      const tx = await contractInstance.createMilestone(amountSmallest, deadlineUnix);
      await tx.wait();

      // 2. Get the new milestone index from the contract
      const milestoneCount = await contractInstance.milestoneCount();
      const order_no = Number(milestoneCount) - 1; // index of the newly created milestone

      // 3. Insert milestone in Supabase with order_no
      const { error } = await supabase.from("milestones").insert([{
        contract_id: contractId,
        title,
        description,
        amount: amountSmallest,
        due_date: deadlineIso,
        status: "pending",
        order_no // <-- store the on-chain index
      }]);
      if (error) throw error;

      alert("Milestone created!");
      refetch();
    } catch (err) {
      alert("Error creating milestone: " + (err.message || err));
    }
  };

  const handleFundMilestone = async (milestone) => {
    if (!contract?.escrow_contract_address) {
      alert("Escrow contract not deployed yet.");
      return;
    }
    try {
      if (!window.ethereum) throw new Error("MetaMask not found");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // 1. Approve USDC for the contract if needed
      const usdc = new ethers.Contract(
        USDC_ADDRESS,
        ["function approve(address spender, uint256 amount) public returns (bool)"],
        signer
      );
      const approveTx = await usdc.approve(contract.escrow_contract_address, milestone.amount);
      await approveTx.wait();

      // 2. Fund milestone on-chain
      const contractInstance = new ethers.Contract(
        contract.escrow_contract_address,
        EscrowMilestoneUSDC.abi,
        signer
      );
      const tx = await contractInstance.fundMilestone(milestone.order_no); // or milestone index/id
      await tx.wait();

      // 3. Update milestone status in Supabase
      await supabase.from("milestones").update({ status: "funded" }).eq("id", milestone.id);

      // 4. Optionally, update escrow table
      await supabase.from("escrow").upsert([{
        milestone_id: milestone.id,
        //contract_id: contractId,
        status: "funded",
        tx_hash: tx.hash
      }], { onConflict: ["milestone_id"] });

      alert("Milestone funded!");
      refetch();
    } catch (err) {
      alert("Error funding milestone: " + (err.message || err));
    }
  };
  
  const handleSubmitDeliverable = async (deliverableData) => {
    const { milestone_id, notes, attachments } = deliverableData;
    const { error } = await supabase.rpc('submit_deliverable', {
      p_milestone_id: milestone_id,
      p_freelancer_id: profile.id,
      p_notes: notes,
      p_file_url: attachments[0]?.file_url || null,
      p_hash: attachments[0]?.hash || null // <-- FIX: Ensure hash is passed to the function
    });

    if (error) alert("Error submitting deliverable: " + error.message);
    else {
      alert('Deliverable submitted successfully!');
      refetch();
    }
  };

  const handleApproveWork = async (milestoneId) => {
    if (!contract?.escrow_contract_address) {
      alert("Escrow contract not deployed yet.");
      return;
    }
    try {
      if (!window.ethereum) throw new Error("MetaMask not found");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Find the milestone object (to get order_no)
      const milestone = milestones.find(m => m.id === milestoneId);
      if (!milestone) throw new Error("Milestone not found");

      // 1. Accept milestone on-chain
      const contractInstance = new ethers.Contract(
        contract.escrow_contract_address,
        EscrowMilestoneUSDC.abi,
        signer
      );
      const tx = await contractInstance.acceptMilestone(milestone.order_no);
      await tx.wait();

      // 2. Update milestone status in Supabase
      await supabase.from("milestones").update({ status: "accepted" }).eq("id", milestone.id);

      // 3. Optionally, update escrow table
      await supabase.from("escrow").upsert([{
        milestone_id: milestone.id,
        //contract_id: contractId,
        status: "released",
        tx_hash: tx.hash
      }], { onConflict: ["milestone_id"] });

      alert("Work approved and payment released!");
      refetch();
    } catch (err) {
      alert("Error approving milestone: " + (err.message || err));
    }
  };

  const handleRejectWork = async (milestoneId) => {
    if (!contract?.escrow_contract_address) {
      alert("Escrow contract not deployed yet.");
      return;
    }
    if (!window.confirm("Are you sure you want to reject this milestone? Funds will be refunded to you.")) {
      return;
    }
    try {
      if (!window.ethereum) throw new Error("MetaMask not found");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Find the milestone object (to get order_no)
      const milestone = milestones.find(m => m.id === milestoneId);
      if (!milestone) throw new Error("Milestone not found");

      // 1. Reject milestone on-chain
      const contractInstance = new ethers.Contract(
        contract.escrow_contract_address,
        EscrowMilestoneUSDC.abi,
        signer
      );
      const tx = await contractInstance.rejectMilestone(milestone.order_no);
      await tx.wait();

      // 2. Update milestone status in Supabase
      await supabase.from("milestones").update({ status: "rejected" }).eq("id", milestone.id);

      // 3. Optionally, update escrow table
      await supabase.from("escrow").upsert([{
        milestone_id: milestone.id,
        //contract_id: contractId,
        status: "refunded",
        tx_hash: tx.hash
      }], { onConflict: ["milestone_id"] });

      alert("Milestone rejected and funds refunded!");
      refetch();
    } catch (err) {
      alert("Error rejecting milestone: " + (err.message || err));
    }
  };
  
  const handleFreelancerCancel = async (milestoneId) => {
     if (window.confirm("Cancel this milestone? Funds will be returned to the client.")) {
      const { error } = await supabase.rpc('freelancer_cancel_milestone', { p_milestone_id: milestoneId });
      if (error) alert("Error: " + error.message);
      else {
        alert("Milestone cancelled and funds returned.");
        refetch();
      }
    }
  };
  
  const handleEndContract = async () => {
    if (window.confirm("Are you sure you want to mark this contract as complete?")) {
        const { error } = await supabase.from('contracts').update({ status: 'completed', end_date: new Date().toISOString() }).eq('id', contractId);
        if (error) alert("Error completing contract: " + error.message);
        else {
            alert("Contract marked as complete!");
            refetch();
        }
    }
  };

  // Deploy contract and set client, USDC
  const handleDeployAndSetupEscrow = async () => {
    setDeploying(true);
    setSetupStatus("Deploying contract...");
    try {
      if (!window.ethereum) throw new Error("MetaMask not found");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // 1. Deploy contract
      const contractAddress = await deployEscrowContract(signer);
      setSetupStatus("Contract deployed. Setting client...");

      // 2. Set client
      const contractInstance = new ethers.Contract(contractAddress, EscrowMilestoneUSDC.abi, signer);
      await contractInstance.setClient(signer.address);
      setSetupStatus("Client set. Setting USDC address...");

      // 3. Set USDC address
      await contractInstance.setUSDC(USDC_ADDRESS);
      setSetupStatus("USDC address set. Waiting for freelancer to set their address...");

      // 4. Store contract address in Supabase
      const { error } = await supabase
        .from("contracts")
        .update({ escrow_contract_address: contractAddress })
        .eq("id", contractId);
      if (error) throw error;

      setSetupStatus("Escrow contract setup complete! Ask the freelancer to connect and set their address.");
      refetch();
    } catch (err) {
      setSetupStatus("Error: " + (err.message || err));
    }
    setDeploying(false);
  };

  // Freelancer sets their address
  const handleSetFreelancer = async () => {
    setSetupStatus("Setting freelancer...");
    try {
      if (!window.ethereum) throw new Error("MetaMask not found");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      if (!contract?.escrow_contract_address) throw new Error("Contract not deployed yet");
      const contractInstance = new ethers.Contract(
        contract.escrow_contract_address,
        EscrowMilestoneUSDC.abi,
        signer
      );
      await contractInstance.setFreelancer(signer.address);
      setSetupStatus("Freelancer set!");
      refetch();
    } catch (err) {
      setSetupStatus("Error: " + (err.message || err));
    }
  };

  const handleRefundIfDeadlineMissed = async (milestoneId) => {
    if (!contract?.escrow_contract_address) {
      alert("Escrow contract not deployed yet.");
      return;
    }
    try {
      if (!window.ethereum) throw new Error("MetaMask not found");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Find the milestone object (to get order_no)
      const milestone = milestones.find(m => m.id === milestoneId);
      if (!milestone) throw new Error("Milestone not found");

      // 1. Refund if deadline missed on-chain
      const contractInstance = new ethers.Contract(
        contract.escrow_contract_address,
        EscrowMilestoneUSDC.abi,
        signer
      );
      const tx = await contractInstance.refundIfDeadlineMissed(milestone.order_no);
      await tx.wait();

      // 2. Update milestone status in Supabase
      await supabase.from("milestones").update({ status: "refunded" }).eq("id", milestone.id);

      // 3. Optionally, update escrow table
      await supabase.from("escrow").upsert([{
        milestone_id: milestone.id,
        //contract_id: contractId,
        status: "refunded",
        tx_hash: tx.hash
      }], { onConflict: ["milestone_id"] });

      alert("Deadline missed. Funds refunded to client!");
      refetch();
    } catch (err) {
      alert("Error refunding milestone: " + (err.message || err));
    }
  };

  if (loading || !profile) return <div className="text-center text-white mt-20">Loading Workspace...</div>;
  if (error || !contract) return <div className="text-center text-red-500 mt-20">Error loading contract data.</div>;

  const isClient = profile.id === contract.client.id;
  const hasUserReviewed = reviews?.some((r) => r.from_id === profile.id);

  return (
    <div className="bg-neutral-950 min-h-screen text-white">
      <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
        <ConnectWalletButton />

        {/* Escrow contract deployment/setup UI */}
        {isClient && !contract?.escrow_contract_address && (
          <div className="mb-6">
            <button
              onClick={handleDeployAndSetupEscrow}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg"
              disabled={deploying}
            >
              {deploying ? "Deploying..." : "Deploy Escrow Contract"}
            </button>
            {setupStatus && <div className="mt-2 text-cyan-300">{setupStatus}</div>}
          </div>
        )}

        {/* Freelancer sets their address after contract is deployed */}
        {!isClient && contract?.escrow_contract_address && (
          <div className="mb-6">
            <button
              onClick={handleSetFreelancer}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Set Freelancer Address
            </button>
            {setupStatus && <div className="mt-2 text-cyan-300">{setupStatus}</div>}
          </div>
        )}

        {contract.status === "completed" && (
          <LeaveReviewPrompt contractId={contract.id} hasUserReviewed={hasUserReviewed} />
        )}

        <ContractOverview contract={contract} milestones={milestones || []} />

        <div>
          <Tabs
            tabs={["Milestones", "Messages"]}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <div className="mt-6">
            {activeTab === "Milestones" && (
              <MilestoneList
                milestones={milestones || []}
                isClient={isClient}
                role={role}
                onCreateMilestone={handleCreateMilestone}
                onFundMilestone={handleFundMilestone}
                onSubmitDeliverable={handleSubmitDeliverable}
                onApproveWork={handleApproveWork}
                onRejectWork={handleRejectWork}
                onFreelancerCancel={handleFreelancerCancel}
                onRefundIfDeadlineMissed={handleRefundIfDeadlineMissed}
              />
            )}
            {activeTab === "Messages" && (
              <div className="h-[70vh] rounded-lg border border-neutral-800 overflow-hidden">
                <ChatInterface initialContractId={contractId} />
              </div>
            )}
          </div>
        </div>

        {isClient && contract.status === "active" && (
          <div className="text-right">
            <button
              onClick={handleEndContract}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Mark Contract as Complete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}