
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function ContractCardDashboard({ contract }) {
  const { profile } = useAuth();
  const { project, client, freelancer, status, milestones } = contract;

  const isClient = profile.id === client.id;
  const otherParty = isClient ? freelancer : client;

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 flex flex-col justify-between">
      <div>
        <p className="text-xs text-neutral-400 uppercase">{isClient ? 'Freelancer' : 'Client'}: {otherParty.full_name}</p>
        <h3 className="font-bold text-lg text-white mt-1">{project.title}</h3>
        <div className="mt-3">
          <span className="text-sm font-semibold text-neutral-300">Status: </span>
          <span className="font-bold capitalize text-cyan-400">{status}</span>
        </div>
        <p className="text-sm text-neutral-400 mt-1">Milestones: {milestones[0]?.count || 0} defined</p>
      </div>
      <div className="mt-4 pt-4 border-t border-neutral-800">
        <Link to={`/contracts/${contract.id}`} className="w-full text-center block bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-2 px-4 rounded-lg transition-colors">
          Manage Contract
        </Link>
      </div>
    </div>
  );
}