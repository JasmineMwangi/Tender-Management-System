import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { runEvaluation } from '../services/evaluationApi'; // add this at the top
import { CheckCircle, XCircle, Clock, DollarSign, Building } from 'lucide-react';

const EvaluateBids = () => {
  const { user } = useAuth();
  const [tenders, setTenders] = useState([]);
  const [selectedTender, setSelectedTender] = useState(null);
  const [bids, setBids] = useState([]);
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [evalLoading, setEvalLoading] = useState(false);
  const [activeTenderId, setActiveTenderId] = useState('');
  const [tenderStats, setTenderStats] = useState({ data: [] });
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
   const [evaluationResults, setEvaluationResults] = useState([]); // add this state at the top

  // Fetch organization's tenders
  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await fetch(`${API_BASE_URL}/tenders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTenders(data);
        setTenderStats({ data });
      } catch (err) {
        console.error('Failed to fetch tenders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTenders();
  }, []);

  // Fetch bids for selected tender
   const fetchBids = async (tenderId) => {
  setSelectedTender(tenders.find(t => t.id === tenderId));
  setActiveTenderId(tenderId);
  setEvalLoading(true);
  try {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${API_BASE_URL}/bids?tenderId=${tenderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    console.log('🎯 tenderId sent:', tenderId);
    console.log('📦 bids returned:', data.length, data[0]); // 👈 add this
    setBids(data);
      // Initialize scoring with zeros
        console.log('Bid fields:', data[0]); // 
      const initialScores = {};
      data.forEach(bid => (initialScores[bid.id] = 0));
      setScores(initialScores);
    } catch (err) {
      console.error('Failed to fetch bids:', err);
    } finally {
      setEvalLoading(false);
    }
  };
 
  
  // Handle score change
  const handleScoreChange = (bidId, value) => {
    setScores(prev => ({ ...prev, [bidId]: Number(value) }));
  };

const handleRunEvaluation = async () => {
  if (!activeTenderId) {
    alert('Please select a tender first!');
    return;
  }

  if (bids.length === 0) {
    alert('No bids available for this tender!');
    return;
  }

  setEvalLoading(true);

  try {
    const response = await runEvaluation(activeTenderId); 
    // this calls POST /api/evaluations/:tenderId/evaluate from your service file
    const results = response.data?.data || [];
    setEvaluationResults(results);
    console.log('📊 evaluation results:', results); // 👈 add this

  } catch (err) {
    console.error('Evaluation failed:', err);
    alert(`Evaluation failed: ${err.response?.data?.message || err.message}`);
  } finally {
    setEvalLoading(false);
  }
};


  // Utility to format currency
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount || 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Bid Evaluation Dashboard</h1>

      {/* Bid Evaluation Matrix — LIVE DATA */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h5 className="text-lg font-semibold text-gray-800"> Interactive Evaluation Matrix</h5>
              <p className="text-sm text-gray-500 mt-1">Side-by-side bid comparison with automated scoring</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Tender selector */}
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={activeTenderId || ''}
                onChange={(e) => fetchBids(e.target.value)}
              >
                <option value="">Select a tender...</option>
                {tenders
                  .filter(t => t.status === 'published' || t.status === 'closed')
                  .map(t => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
              </select>
              <button
                onClick={handleRunEvaluation}
                // disabled={!activeTenderId || evalLoading || bids.length === 0}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center gap-2"
              >
                {evalLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Scoring...
                  </>
                ) : (
                  <>
                    ▶ Run Evaluation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tender Info */}
        {selectedTender && (
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle size={18} />
                <span>{selectedTender.status?.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <DollarSign size={18} />
                <span>{bids.length} bids received</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={18} />
                <span>Closes: {selectedTender.closingDate || 'TBD'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bid Table */}
      {selectedTender && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {selectedTender.title} - Bid Evaluation
            </h2>
            <div className="text-sm text-gray-500">
              Total Score Average: {Object.values(scores).length > 0 
                ? (Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length).toFixed(1)
                : '0'} / 100
            </div>
          </div>
          
          {evalLoading ? (
            <div className="text-center py-20 text-gray-500 flex items-center justify-center gap-3">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              <span>Loading bids...</span>
            </div>
          ) : bids.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No bids submitted yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">#</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Bidder</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Amount</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Proposal Summary</th>
                    {/* <th className="px-6 py-4 text-left font-semibold text-gray-700">Score (0-100)</th> */}
                    {/* <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th> */}
                  </tr>
                </thead>
                <tbody>
                  {bids.map((bid, index) => (
                    <tr key={bid.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900"> {bid.user?.name || bid.bidderName || 'Unknown'}</div>
                        {bid.user?.email && (
                          <div className="text-sm text-gray-500">{bid.user.email}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono font-semibold text-green-600">
                        {formatCurrency(bid.amount)}
                      </td>
                      <td className="px-6 py-4 max-w-md">
                        <div className="text-sm text-gray-900 line-clamp-2">
                          {bid.summary || 'No summary provided'}
                        </div>
                      </td>
                      {/* <td className="px-6 py-4">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={scores[bid.id] || 0}
                          onChange={(e) => handleScoreChange(bid.id, e.target.value)}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-3 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
                          placeholder="0"
                        />
                      </td> */}
                      {/* <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          scores[bid.id] >= 80 ? 'bg-green-100 text-green-800' :
                          scores[bid.id] >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {scores[bid.id] || 0}/100
                        </span>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {evaluationResults.length > 0 && (
  <div className="bg-white rounded-lg shadow-md p-6 mt-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Evaluation Results</h2>
    <table className="min-w-full border border-gray-200 rounded-lg">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Bidder</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quality</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Timeline</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Experience</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Compliance</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total Score</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
        </tr>
      </thead>
      <tbody>

        
       {evaluationResults
  .sort((a, b) => (a.rank || 999) - (b.rank || 999))
  .map((result) => (
    <tr key={result.bidId} className="border-t border-gray-100 hover:bg-gray-50">
      
      {/* Rank */}
      <td className="px-6 py-4 font-bold text-blue-600">
        {result.rank ? `#${result.rank}` : 'DQ'}
      </td>

      {/* Bidder Name */}
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900">
          {bids.find(b => b.userId === result.bidderId)?.user?.name || 'Unknown'}
        </div>
        <div className="text-sm text-gray-500">
          {bids.find(b => b.userId === result.bidderId)?.user?.email || ''}
        </div>
      </td>

      {/* Scores */}
      <td className="px-6 py-4">{result.priceScore ?? '—'}</td>
      <td className="px-6 py-4">{result.qualityScore ?? '—'}</td>
      <td className="px-6 py-4">{result.timelineScore ?? '—'}</td>
      <td className="px-6 py-4">{result.experienceScore ?? '—'}</td>
      <td className="px-6 py-4">{result.complianceScore ?? '—'}</td>
      <td className="px-6 py-4 font-semibold text-green-700">
        {result.totalScore ?? '—'}
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          result.passesMandatoryChecks
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {result.passesMandatoryChecks ? 'Qualified' : 'Disqualified'}
        </span>
      </td>

    </tr>
  ))}
      </tbody>
    </table>
  </div>
)}

      {/* Quick Actions */}
      {selectedTender && bids.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="text-sm text-blue-800">
              <span className="font-semibold">{bids.length}</span> bids ready for evaluation
            </div>
            <button
              onClick={handleRunEvaluation}
              disabled={evalLoading || Object.values(scores).some(s => s === '')}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {evalLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Running Evaluation...
                </>
              ) : (
                '🚀 Run Full Evaluation'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluateBids;