import { ethers } from "ethers";
import EscrowMilestoneUSDC from "./EscrowMilestoneUSDC.json";

/**
 * Deploys a new EscrowMilestoneUSDC contract.
 * @param {ethers.Signer} signer - The ethers.js signer (connected wallet).
 * @returns {Promise<string>} The deployed contract address.
 */
export async function deployEscrowContract(signer) {
  // Prepare contract factory with ABI and bytecode
  const factory = new ethers.ContractFactory(
    EscrowMilestoneUSDC.abi,
    EscrowMilestoneUSDC.bytecode,
    signer
  );

  // Deploy contract (no constructor args)
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  // Get deployed contract address
  const contractAddress = await contract.getAddress();
  return contractAddress;
}