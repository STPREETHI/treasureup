
import React from 'react';

interface TotalCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  colorClass: string;
}

const TotalCard: React.FC<TotalCardProps> = ({ title, amount, icon, colorClass }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
      <div className={`p-3 rounded-full ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">
          ₹{amount.toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
};

export default TotalCard;
