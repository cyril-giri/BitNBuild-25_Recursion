import { Link } from 'react-router-dom';

export default function ContractCard({ contract, currentUserId }) {
  const { project, client, freelancer, status } = contract;
  
  // Determine who the "other party" is from the current user's perspective
  const otherParty = client.id === currentUserId ? freelancer : client;
  const roleToShow = client.id === currentUserId ? 'Freelancer' : 'Client';

  // Helper to determine the card's border color based on status
  const getStatusClass = (status) => {
    switch (status) {
      case 'active':
      case 'in_progress':
        return 'border-cyan-500';
      case 'completed':
        return 'border-green-500';
      case 'cancelled':
      case 'disputed':
        return 'border-red-500';
      default:
        return 'border-neutral-700';
    }
  };

  return (
    <Link to={`/contracts/${contract.id}`} className="block">
      <div className={`rounded-xl border-l-4 ${getStatusClass(status)} bg-neutral-900 p-6 hover:bg-neutral-800/50 transition-colors`}>
        <div className="flex flex-col sm:flex-row justify-between items-start">
          <div>
            <p className="text-xs text-neutral-400 uppercase">{roleToShow}: {otherParty.full_name}</p>
            <h3 className="font-bold text-xl text-white mt-1">{project.title}</h3>
          </div>
          <div className="text-left sm:text-right mt-2 sm:mt-0">
            <p className="text-xs text-neutral-400">Status</p>
            <p className="font-semibold capitalize">{status}</p>
          </div>
        </div>
        <p className="text-neutral-400 text-sm mt-2 pt-4 border-t border-neutral-800">
          {project.short_description}
        </p>
      </div>
    </Link>
  );
}