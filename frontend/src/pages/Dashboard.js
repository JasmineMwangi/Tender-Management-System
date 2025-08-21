import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Activity, 
  Users, 
  FileText, 
  AlertCircle, 
  TrendingUp, 
  Shield, 
  Bell, 
  Download,
  Search,
  Filter,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  DollarSign,
  Award,
  BarChart3,
  PieChart,
  LineChart,
  Zap,
  Settings,
  Eye,
  Edit3,
  Target,
  Heart,
  ChevronRight
} from 'lucide-react';



const useApi = (apiCall, deps) => {
  const [state, setState] = useState({ data: null, loading: true });
  
  useEffect(() => {
    setTimeout(() => {
      if (apiCall.toString().includes('tenderAPI')) {
        setState({
          data: {
            pagination: { totalItems: 247 },
            data: [
              { id: 1, title: 'Highway Bridge Construction', status: 'active', deadline: '2024-12-25' },
              { id: 2, title: 'IT Infrastructure Upgrade', status: 'evaluating', deadline: '2024-12-20' },
              { id: 3, title: 'School Renovation Project', status: 'awarded', deadline: '2024-11-30' },
              { id: 4, title: 'Water Treatment Plant', status: 'active', deadline: '2024-12-28' },
              { id: 5, title: 'Solar Panel Installation', status: 'active', deadline: '2024-12-22' }
            ]
          },
          loading: false
        });
      } else {
        setState({
          data: {
            pagination: { totalItems: 156 },
            data: [
              { id: 1, tender: { title: 'Bridge Construction' }, status: 'submitted', created_at: '2024-12-10' },
              { id: 2, tender: { title: 'IT System Upgrade' }, status: 'evaluating', created_at: '2024-12-08' },
              { id: 3, tender: { title: 'Park Development' }, status: 'awarded', created_at: '2024-12-05' }
            ]
          },
          loading: false
        });
      }
    }, 1000);
  }, deps);
  
  return state;
};

const Dashboard = () => {
  // const { user } = useAuth();
    const { user, logout } = useAuth();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', message: 'Unusual bidding activity detected in Infrastructure category', priority: 'high', time: '2 min ago' },
    { id: 2, type: 'info', message: 'New tender published: Solar Panel Installation', priority: 'medium', time: '15 min ago' },
    { id: 3, type: 'warning', message: '3 tenders approaching deadline in next 24 hours', priority: 'high', time: '30 min ago' }
  ]);
  
  const { data: tenderStats, loading: tenderLoading } = useApi(
    () => ({ getAll: () => ({}) }),
    []
  );
  
  const { data: bidStats, loading: bidLoading } = useApi(
    () => ({ getAll: () => ({}) }),
    []
  );

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Admin Dashboard Data
  const systemHealth = {
    score: 94,
    activeTenders: 247,
    totalUsers: 1534,
    pendingApprovals: 23,
    uptime: '99.8%'
  };

  const userBreakdown = {
    bidders: 1200,
    organizations: 280,
    admins: 54
  };

  const tenderCategories = [
    { name: 'Infrastructure', value: 45, color: '#3B82F6', trend: '+12%' },
    { name: 'IT Services', value: 32, color: '#10B981', trend: '+8%' },
    { name: 'Construction', value: 28, color: '#F59E0B', trend: '-3%' },
    { name: 'Healthcare', value: 22, color: '#EF4444', trend: '+15%' },
    { name: 'Green Energy', value: 18, color: '#8B5CF6', trend: '+20%' },
    { name: 'Education', value: 15, color: '#06B6D4', trend: '+5%' }
  ];

  const topUsers = [
    { name: 'TechCorp Solutions', type: 'bidder', activity: 98, bids: 34 },
    { name: 'Infrastructure Ltd', type: 'bidder', activity: 95, bids: 28 },
    { name: 'Ministry of Health', type: 'organization', activity: 92, tenders: 15 },
    { name: 'Green Energy Co', type: 'bidder', activity: 89, bids: 22 }
  ];

  const auditEvents = [
    { id: 1, action: 'Tender Modified', user: 'admin@gov.ke', tender: 'Road Construction KSH 50M', time: '10:30 AM', risk: 'low' },
    { id: 2, action: 'Bid Submitted', user: 'techcorp@email.com', tender: 'IT Infrastructure Upgrade', time: '09:45 AM', risk: 'low' },
    { id: 3, action: 'Multiple Login Attempts', user: 'suspicious@email.com', tender: '-', time: '08:20 AM', risk: 'high' },
    { id: 4, action: 'Tender Deadline Extended', user: 'admin@transport.ke', tender: 'Bridge Construction', time: '07:15 AM', risk: 'medium' }
  ];

  const HealthGauge = ({ score }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    
    const getColor = (score) => {
      if (score >= 90) return '#10B981';
      if (score >= 70) return '#F59E0B';
      return '#EF4444';
    };

    return (
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#E5E7EB"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={getColor(score)}
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{score}</div>
            <div className="text-xs text-gray-500">Health</div>
          </div>
        </div>
      </div>
    );
  };

  const Heatmap = () => {
    const regions = ['Nairobi', 'Mombasa', 'Kisumu', 'Eldoret', 'Nakuru', 'Thika'];
    const getIntensity = () => Math.random();
    
    return (
      <div className="grid grid-cols-3 gap-2">
        {regions.map((region, index) => {
          const intensity = getIntensity();
          const bgOpacity = intensity * 0.8 + 0.2;
          return (
            <div
              key={index}
              className="p-3 rounded-lg border text-center transition-all hover:scale-105 cursor-pointer"
              style={{ backgroundColor: `rgba(59, 130, 246, ${bgOpacity})` }}
            >
              <div className="text-white font-semibold text-sm">{region}</div>
              <div className="text-white text-xs mt-1">{Math.floor(intensity * 50)} tenders</div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDashboardContent = () => {
    switch (user.role) {
      case 'admin':
        return (
          <div className="space-y-8">
            {/* System Health Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
                  <Zap className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-center">
                  <HealthGauge score={systemHealth.score} />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Uptime</span>
                    <span className="font-semibold text-green-600">{systemHealth.uptime}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Active Tenders</p>
                      <p className="text-3xl font-bold text-gray-900">{systemHealth.activeTenders}</p>
                      <p className="text-green-600 text-sm">+12 this week</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Users</p>
                      <p className="text-3xl font-bold text-gray-900">{systemHealth.totalUsers}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        <span className="text-blue-600">{userBreakdown.bidders} bidders</span> • 
                        <span className="text-purple-600"> {userBreakdown.organizations} orgs</span>
                      </div>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Users className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Pending Approvals</p>
                      <p className="text-3xl font-bold text-gray-900">{systemHealth.pendingApprovals}</p>
                      <p className="text-orange-600 text-sm">Requires attention</p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Clock className="w-8 h-8 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics and Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Regional Distribution</h3>
                  <MapPin className="w-5 h-5 text-blue-500" />
                </div>
                <Heatmap />
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-green-800 text-sm font-medium">
                      AI Insight: Green energy tenders up 20% this month in Nairobi region
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Category Performance</h3>
                  <BarChart3 className="w-5 h-5 text-green-500" />
                </div>
                <div className="space-y-4">
                  {tenderCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="text-sm font-medium text-gray-700">{category.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{category.value}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          category.trend.startsWith('+') 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {category.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* User Management & Audit */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Top Active Users</h3>
                  <Award className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="space-y-4">
                  {topUsers.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500 capitalize">{user.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{user.activity}% active</p>
                        <p className="text-xs text-gray-500">
                          {user.bids ? `${user.bids} bids` : `${user.tenders} tenders`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <Shield className="w-5 h-5 text-red-500" />
                </div>
                <div className="space-y-4">
                  {auditEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border-l-4 border-gray-200">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{event.action}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            event.risk === 'high' ? 'bg-red-100 text-red-800' :
                            event.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {event.risk}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{event.user}</p>
                        <p className="text-xs text-gray-500">{event.time}</p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Notifications and Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Smart Notifications</h3>
                  <Bell className="w-5 h-5 text-blue-500" />
                </div>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`p-4 rounded-lg border-l-4 ${
                      notification.priority === 'high' ? 'border-red-500 bg-red-50' :
                      notification.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                      'border-blue-500 bg-blue-50'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-green-600 hover:text-green-800">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Reports</h3>
                  <Download className="w-5 h-5 text-green-500" />
                </div>
                <div className="space-y-4">
                  <button className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Monthly Tender Summary</p>
                        <p className="text-sm text-gray-600">Complete overview of all tender activities</p>
                      </div>
                      <PieChart className="w-5 h-5 text-blue-500" />
                    </div>
                  </button>
                  
                  <button className="w-full p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all text-left">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">User Activity Report</p>
                        <p className="text-sm text-gray-600">Detailed user engagement analytics</p>
                      </div>
                      <LineChart className="w-5 h-5 text-green-500" />
                    </div>
                  </button>
                </div>
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
                      <button className="text-red-500 hover:text-red-700 text-xl">
                        <Heart className="w-5 h-5" />
                      </button>
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
                      <button className="text-red-500 hover:text-red-700 text-xl">
                        <Heart className="w-5 h-5" />
                      </button>
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {user.name}!
            </h1>
            <p className="text-gray-600">
              Role: <span className="capitalize font-medium">{user.role.replace('_', ' ')}</span>
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">System Time</div>
              <div className="font-mono text-lg">{currentTime.toLocaleTimeString()}</div>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </button>
          </div>
        </div>
      </div>
      
      {renderDashboardContent()}
    </div>
  );
};

export default Dashboard;