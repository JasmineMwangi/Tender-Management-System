// frontend/src/pages/Dashboard.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import { tenderAPI, bidAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  
  const { data: tenderStats, loading: tenderLoading } = useApi(
    () => tenderAPI.getAll({ page: 1, limit: 5 }),
    []
  );
  
  const { data: bidStats, loading: bidLoading } = useApi(
    () => bidAPI.getAll({ page: 1, limit: 5 }),
    []
  );

  const renderDashboardContent = () => {
    switch (user.role) {
      case 'admin':
        return (
          <div className="dashboard-admin">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Tenders</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {tenderLoading ? 'Loading...' : tenderStats?.pagination?.totalItems || 0}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Bids</h3>
                <p className="text-3xl font-bold text-green-600">
                  {bidLoading ? 'Loading...' : bidStats?.pagination?.totalItems || 0}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Tenders</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {tenderLoading ? 'Loading...' : 
                   tenderStats?.data?.filter(t => t.status === 'active').length || 0}
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'organization':
        return (
          <div className="dashboard-procuring space-y-6">
            {/* Organization Dashboard Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-4xl mb-2">📊</div>
                <h5 className="text-xl font-semibold mb-1">{tenderStats?.pagination?.totalItems || 0}</h5>
                <p className="text-gray-500">Active Tenders</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-4xl mb-2">📈</div>
                <h5 className="text-xl font-semibold mb-1">{bidStats?.pagination?.totalItems || 0}</h5>
                <p className="text-gray-500">Total Bids</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-4xl mb-2">💰</div>
                <h5 className="text-xl font-semibold mb-1">$12.3M</h5>
                <p className="text-gray-500">Total Value</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-4xl mb-2">⚖️</div>
                <h5 className="text-xl font-semibold mb-1">18.5</h5>
                <p className="text-gray-500">Avg Days to Award</p>
              </div>
            </div>

            {/* Tender Portfolio Overview */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="border-b border-gray-200 p-6">
                <h5 className="text-lg font-semibold text-gray-800 flex items-center">
                  📊 Tender Portfolio Overview
                </h5>
                <p className="text-sm text-gray-500 mt-1">Grid view with AI-powered bid quality scores</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {tenderLoading ? (
                    <div className="col-span-full flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    tenderStats?.data?.map(tender => (
                      <div key={tender.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h6 className="font-semibold text-gray-800 text-sm">{tender.title}</h6>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tender.status === 'active' ? 'bg-green-100 text-green-800' : 
                            tender.status === 'evaluating' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {tender.status === 'active' ? 'Open' : 
                             tender.status === 'evaluating' ? 'Evaluating' : 'Awarded'}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm mb-3">
                          Deadline: {new Date(tender.deadline).toLocaleDateString()}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                            {Math.floor(Math.random() * 15) + 3} Bids
                          </span>
                          <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full text-xs">
                            AI Score: {Math.floor(Math.random() * 20) + 80}%
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Bid Evaluation Matrix */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="border-b border-gray-200 p-6">
                <h5 className="text-lg font-semibold text-gray-800 flex items-center">
                  ⚖️ Interactive Evaluation Matrix
                </h5>
                <p className="text-sm text-gray-500 mt-1">Side-by-side bid comparison with automated scoring</p>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-900">Bidder</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-900">Price</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-900">Quality</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-900">Timeline</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-900">Experience</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-900">Total Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-gray-900">Construction Co. A</td>
                        <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">9.2</span></td>
                        <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">8.8</span></td>
                        <td className="px-4 py-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">7.5</span></td>
                        <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">9.1</span></td>
                        <td className="px-4 py-3 font-semibold">8.65</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-gray-900">BuildTech Solutions</td>
                        <td className="px-4 py-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">7.8</span></td>
                        <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">9.3</span></td>
                        <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">9.0</span></td>
                        <td className="px-4 py-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">8.2</span></td>
                        <td className="px-4 py-3 font-semibold">8.58</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-gray-900">Metro Builders</td>
                        <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">8.9</span></td>
                        <td className="px-4 py-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">7.6</span></td>
                        <td className="px-4 py-3"><span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">6.8</span></td>
                        <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">8.7</span></td>
                        <td className="px-4 py-3 font-semibold">8.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Bidder Engagement Funnel */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="border-b border-gray-200 p-6">
                <h5 className="text-lg font-semibold text-gray-800 flex items-center">
                  📈 Bidder Engagement Funnel
                </h5>
                <p className="text-sm text-gray-500 mt-1">Visual funnel showing bidder journey</p>
              </div>
              <div className="p-6 text-center">
                <div className="space-y-4">
                  <div className="relative">
                    <div className="w-full bg-blue-600 rounded-full h-10 flex items-center justify-center text-white font-semibold">
                      1,240 Tender Views
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-3/4 bg-yellow-500 rounded-full h-10 flex items-center justify-center text-white font-semibold mx-auto">
                      875 Document Downloads
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-1/2 bg-green-600 rounded-full h-10 flex items-center justify-center text-white font-semibold mx-auto">
                      {bidStats?.pagination?.totalItems || 156} Bid Submissions
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-sm text-gray-500">📊 Conversion Rate: 12.6% (Industry Average: 8.3%)</p>
                </div>
              </div>
            </div>

            {/* Process Timeline */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="border-b border-gray-200 p-6">
                <h5 className="text-lg font-semibold text-gray-800 flex items-center">
                  🔄 Tender Process Timeline
                </h5>
                <p className="text-sm text-gray-500 mt-1">Streamlined workflow management</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg mr-4">
                      📝
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Tender Published</div>
                      <div className="text-sm text-gray-500">Highway Bridge Construction • 2 days ago</div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white text-lg mr-4">
                      👥
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Bidder Interest Registered</div>
                      <div className="text-sm text-gray-500">8 companies registered • 1 day ago</div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center text-white text-lg mr-4">
                      📋
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Clarification Period Active</div>
                      <div className="text-sm text-gray-500">3 questions received • Ongoing</div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white text-lg mr-4">
                      ⏰
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Submission Deadline</div>
                      <div className="text-sm text-gray-500">12 days remaining • Dec 25, 2024</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'bidder':
        return (
          <div className="dashboard-bidder space-y-6">
            {/* Dashboard Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-4xl mb-2">🎯</div>
                <h5 className="text-xl font-semibold mb-1">34%</h5>
                <p className="text-gray-500">Win Rate</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-4xl mb-2">📋</div>
                <h5 className="text-xl font-semibold mb-1">{bidStats?.pagination?.totalItems || 8}</h5>
                <p className="text-gray-500">Active Bids</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-4xl mb-2">💰</div>
                <h5 className="text-xl font-semibold mb-1">$2.1M</h5>
                <p className="text-gray-500">Avg Value</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-4xl mb-2">⏰</div>
                <h5 className="text-xl font-semibold mb-1">3</h5>
                <p className="text-gray-500">Urgent</p>
              </div>
            </div>

            {/* Recommended Tenders */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="border-b border-gray-200 p-6">
                <h5 className="text-lg font-semibold text-gray-800 flex items-center">
                  🎯 Recommended for You
                </h5>
                <p className="text-sm text-gray-500 mt-1">AI-powered suggestions based on your profile</p>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-green-200 bg-white rounded-lg shadow-sm">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">92% Match</span>
                      <button className="text-red-500 hover:text-red-700 text-xl">💖</button>
                    </div>
                    <h6 className="font-semibold text-gray-900 mb-2">Highway Bridge Construction</h6>
                    <p className="text-gray-500 text-sm mb-3">$2.5M • 15 days left</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Infrastructure</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Construction</span>
                    </div>
                  </div>
                </div>
                <div className="border-2 border-green-200 bg-white rounded-lg shadow-sm">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">87% Match</span>
                      <button className="text-red-500 hover:text-red-700 text-xl">💖</button>
                    </div>
                    <h6 className="font-semibold text-gray-900 mb-2">City Water Treatment Plant</h6>
                    <p className="text-gray-500 text-sm mb-3">$1.8M • 8 days left</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Water Systems</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Municipal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bid Pipeline */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="border-b border-gray-200 p-6">
                <h5 className="text-lg font-semibold text-gray-800 flex items-center">
                  📋 Your Bid Pipeline
                </h5>
                <p className="text-sm text-gray-500 mt-1">Drag & drop to organize</p>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Draft */}
                <div>
                  <h6 className="font-semibold text-gray-900 mb-4 flex items-center">
                    📝 Draft 
                    <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">2</span>
                  </h6>
                  <div className="space-y-3">
                    <div className="border-2 border-yellow-200 bg-white rounded-lg p-4">
                      <h6 className="font-semibold text-gray-900 mb-2">School Renovation</h6>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: '60%'}}></div>
                      </div>
                      <p className="text-sm text-gray-500">60% complete • Due: 5 days</p>
                    </div>
                    <div className="border-2 border-yellow-200 bg-white rounded-lg p-4">
                      <h6 className="font-semibold text-gray-900 mb-2">Park Infrastructure</h6>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: '30%'}}></div>
                      </div>
                      <p className="text-sm text-gray-500">30% complete • Due: 12 days</p>
                    </div>
                  </div>
                </div>

                {/* Submitted */}
                <div>
                  <h6 className="font-semibold text-gray-900 mb-4 flex items-center">
                    📤 Submitted 
                    <span className="ml-2 px-2 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs">{bidStats?.data?.length || 0}</span>
                  </h6>
                  {bidLoading ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bidStats?.data?.map(bid => (
                        <div key={bid.id} className="border-2 border-cyan-200 bg-white rounded-lg p-4">
                          <h6 className="font-semibold text-gray-900 mb-1">{bid.tender?.title || 'Tender'}</h6>
                          <p className="text-sm text-gray-500">Status: {bid.status}</p>
                          <p className="text-sm text-gray-500">{new Date(bid.created_at).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Won */}
                <div>
                  <h6 className="font-semibold text-gray-900 mb-4 flex items-center">
                    🏆 Won 
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">1</span>
                  </h6>
                  <div className="border-2 border-green-200 bg-white rounded-lg p-4">
                    <div className="text-center text-2xl mb-2">✨</div>
                    <h6 className="font-semibold text-gray-900 mb-1">Mall Complex</h6>
                    <p className="text-xl font-bold text-green-600 mb-1">$3.2M</p>
                    <p className="text-sm text-gray-500">Awarded 2 days ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Deadline Countdown */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="border-b border-gray-200 p-6">
                <h5 className="text-lg font-semibold text-gray-800 flex items-center">
                  ⏰ Urgent Deadlines
                </h5>
                <p className="text-sm text-gray-500 mt-1">Stay ahead of the competition</p>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-red-600 mb-2">2d 14h 23m</div>
                  <div className="font-semibold text-gray-900 text-lg">Municipal Building Project</div>
                  <div className="mt-3">
                    <p className="text-sm text-gray-500">💡 Submit 24h early for better visibility</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
                    <span className="text-gray-700">Highway Bridge - 2 days</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></span>
                    <span className="text-gray-700">Water Plant - 8 days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Analytics & Resources */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md h-full">
                <div className="border-b border-gray-200 p-4">
                  <h6 className="font-semibold text-gray-800">📈 Your Performance</h6>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-4 text-center mb-4">
                    <div>
                      <div className="text-lg font-bold text-gray-900">34%</div>
                      <div className="text-sm text-gray-500">Win Rate</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">$2.1M</div>
                      <div className="text-sm text-gray-500">Avg Bid</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">↗️ +12%</div>
                      <div className="text-sm text-gray-500">Trend</div>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">🎯 Focus on tech tenders - 15% higher win rate!</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md h-full">
                <div className="border-b border-gray-200 p-4">
                  <h6 className="font-semibold text-gray-800">📚 Quick Resources</h6>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-3xl mb-2">📄</div>
                      <div className="font-semibold text-gray-900 text-sm">Templates</div>
                      <div className="text-sm text-gray-500">12 available</div>
                    </div>
                    <div>
                      <div className="text-3xl mb-2">👥</div>
                      <div className="font-semibold text-gray-900 text-sm">Bid Buddy</div>
                      <div className="text-sm text-gray-500">3 collaborators</div>
                    </div>
                    <div>
                      <div className="text-3xl mb-2">📊</div>
                      <div className="font-semibold text-gray-900 text-sm">Archive</div>
                      <div className="text-sm text-gray-500">Past bids</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Strength */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="border-b border-gray-200 p-4">
                <h6 className="font-semibold text-gray-800">🏆 Profile Strength</h6>
                <p className="text-sm text-gray-500">Boost your visibility</p>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-4xl font-bold text-gray-900">78%</span>
                  <div className="flex-1 ml-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-green-600 h-3 rounded-full" style={{width: '78%'}}></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="mr-2">✅</span>
                    <span className="text-gray-700">Certifications uploaded</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">✅</span>
                    <span className="text-gray-700">Portfolio complete</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">⚠️</span>
                    <span className="text-gray-700">Add 2 more references (+15%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="text-center text-gray-500">Welcome to TenderMS</div>;
    }
  };

  return (
    <div className="dashboard min-h-screen bg-gray-50 p-6">
      <div className="dashboard-header mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user.name}!</h1>
        <p className="text-gray-600">Role: <span className="capitalize font-medium">{user.role.replace('_', ' ')}</span></p>
      </div>
      
      {renderDashboardContent()}
    </div>
  );
};

export default Dashboard;