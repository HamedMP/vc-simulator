'use client'; 
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const VCLiquidationSimulation = () => {
  const [investmentAmount, setInvestmentAmount] = useState(1000000);
  const [multiple, setMultiple] = useState(1);
  const [hasParticipation, setHasParticipation] = useState(false);
  const [ownershipPercentage, setOwnershipPercentage] = useState(20);

  const calculateVCPayout = (exitValue) => {
    const liquidationPreference = investmentAmount * multiple;
    const ownershipPayout = exitValue * (ownershipPercentage / 100);
    
    if (hasParticipation) {
      // With participation, VC gets liquidation preference plus pro-rata share of remaining
      return Math.min(exitValue, liquidationPreference + ownershipPayout);
    } else {
      // Without participation, VC gets the greater of liquidation preference or ownership payout
      return Math.max(liquidationPreference, ownershipPayout);
    }
  };

  const generateData = useMemo(() => {
    const data = [];
    for (let exitValue = 0; exitValue <= 10000000; exitValue += 100000) {
      const vcPayout = calculateVCPayout(exitValue);
      const founderPayout = Math.max(0, exitValue - vcPayout);
      data.push({
        exitValue,
        vcPayout,
        founderPayout,
      });
    }
    return data;
  }, [investmentAmount, multiple, hasParticipation, ownershipPercentage]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">VC Liquidation Preference Simulation</h1>
      <div className="mb-4">
        <label className="block mb-2">
          Investment Amount: ${investmentAmount.toLocaleString()}
          <input
            type="range"
            min="100000"
            max="5000000"
            step="100000"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(Number(e.target.value))}
            className="w-full"
          />
        </label>
        <label className="block mb-2">
          Liquidation Preference Multiple: {multiple}x
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={multiple}
            onChange={(e) => setMultiple(Number(e.target.value))}
            className="w-full"
          />
        </label>
        <label className="block mb-2">
          VC Ownership Percentage: {ownershipPercentage}%
          <input
            type="range"
            min="1"
            max="50"
            step="1"
            value={ownershipPercentage}
            onChange={(e) => setOwnershipPercentage(Number(e.target.value))}
            className="w-full"
          />
        </label>
        <label className="block mb-2">
          <input
            type="checkbox"
            checked={hasParticipation}
            onChange={(e) => setHasParticipation(e.target.checked)}
          />
          {' '}Participation
        </label>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={generateData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="exitValue"
            tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
            label={{ value: 'Exit Value', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
            label={{ value: 'Payout', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value) => `$${(value / 1000000).toFixed(2)}M`}
            labelFormatter={(value) => `Exit Value: $${(value / 1000000).toFixed(2)}M`}
          />
          <Legend />
          <Line type="monotone" dataKey="vcPayout" stroke="#8884d8" name="VC Payout" />
          <Line type="monotone" dataKey="founderPayout" stroke="#82ca9d" name="Founder Payout" />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Explanation</h2>
        <p>
          This simulation shows how liquidation preferences affect the payout structure between VCs and founders
          at different exit values. Adjust the parameters to see how they impact the distribution of returns.
        </p>
        <ul className="list-disc pl-5 mt-2">
          <li><strong>Investment Amount:</strong> The amount invested by the VC.</li>
          <li><strong>Liquidation Preference Multiple:</strong> Determines the preference amount (Investment * Multiple).</li>
          <li><strong>VC Ownership Percentage:</strong> The VC's equity stake in the company.</li>
          <li><strong>Participation:</strong> If off, VC gets the greater of preference or ownership %. If on, VC gets preference plus pro-rata share of remaining (capped at 100% of exit value).</li>
        </ul>
      </div>
    </div>
  );
};

export default VCLiquidationSimulation;
