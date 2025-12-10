import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle, 
  Map, 
  Users, 
  FileText, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Send, 
  ThumbsUp, 
  XCircle,
  Search,
  Menu,
  Bell,
  MoreVertical,
  Activity,
  ShieldAlert
} from 'lucide-react';

// --- Mock Data ---

const INITIAL_TASKS = [
  {
    id: 'T-1023',
    caregiver: 'Jeanna Koester',
    client: 'Debra Clayton',
    type: 'Missed Clock-out',
    time: '09/30/2025 • 1:15 PM',
    location: 'Chicago, IL',
    status: 'pending_review',
    confidence: 92,
    ai_suggestion: 'Update End Time to 13:15',
    tags: ['evv__manual_clock_out', 'cta_il_english'],
    chat_history: [
      { sender: 'ai', text: 'Hi Jeanna, our records show a missed clock-out for your visit with Debra Clayton today. Can you confirm your end time?', time: '1:30 PM' },
      { sender: 'caregiver', text: 'Oh sorry! I left at 1:15pm.', time: '1:32 PM' },
      { sender: 'ai', text: 'Thanks. I have updated your timesheet to 1:15 PM. Please remember to clock out via the app next time to ensure timely payment.', time: '1:33 PM' }
    ]
  },
  {
    id: 'T-1024',
    caregiver: 'Takeeya Brooks',
    client: 'Willie Jones',
    type: 'GPS Mismatch',
    time: '09/30/2025 • 9:00 AM',
    location: 'Peoria, IL',
    status: 'pending_review',
    confidence: 45,
    ai_suggestion: 'Escalate to Branch',
    tags: ['gps_distance', 'geo_fencing'],
    chat_history: [
      { sender: 'ai', text: 'Hi Takeeya, your clock-in location for Willie Jones was 2 miles away. Were you at the client\'s home?', time: '9:05 AM' },
      { sender: 'caregiver', text: 'I picked him up for a doctor appt.', time: '9:10 AM' }
    ]
  },
  {
    id: 'T-1025',
    caregiver: 'Vanessa Williams',
    client: 'Peggy Smith',
    type: 'No Show Exception',
    time: '09/30/2025 • 3:30 PM',
    location: 'Philadelphia, PA',
    status: 'pending_review',
    confidence: 88,
    ai_suggestion: 'Mark as Verified',
    tags: ['sandata__no_show_exception', 'cta_pa_english'],
    chat_history: [
      { sender: 'ai', text: 'Hi Vanessa, we didn\'t receive a clock-in for Peggy today. Did this visit occur?', time: '3:45 PM' },
      { sender: 'caregiver', text: 'Yes, I was there 3:30 to 5:30. App crashed.', time: '3:46 PM' }
    ]
  }
];

const COMPLIANCE_DATA = [
  { id: 1, name: 'Jeanna Koester', offenses: 12, last_incident: 'Missed Clock-out', risk: 'High' },
  { id: 2, name: 'Marcia Hamilton', offenses: 8, last_incident: 'Task Entry Missing', risk: 'Medium' },
  { id: 3, name: 'Stephon Hudson', offenses: 5, last_incident: 'GPS Mismatch', risk: 'Low' },
  { id: 4, name: 'Wilma L. Kelly', offenses: 4, last_incident: 'Late Clock-in', risk: 'Low' },
];

const RECENT_ACTIVITY = [
  { id: 1, text: 'AI resolved Missed Clock-in for Kelsey Hunt', time: '2 mins ago', type: 'auto' },
  { id: 2, text: 'AI resolved GPS Alert for Clyde E. Taylor', time: '5 mins ago', type: 'auto' },
  { id: 3, text: 'Coordinator J. Diaz manually updated schedule for Zella Coleman', time: '12 mins ago', type: 'manual' },
  { id: 4, text: 'System flagged 5 new No-Show Exceptions in PA', time: '15 mins ago', type: 'alert' },
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors duration-200 ${
      active 
        ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={20} />
      <span>{label}</span>
    </div>
    {count && (
      <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
        {count}
      </span>
    )}
  </button>
);

const StatCard = ({ title, value, subtext, trend, trendUp, icon: Icon, colorClass }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      <div className="flex items-center mt-2 gap-2">
        <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {trend}
        </span>
        <span className="text-gray-400 text-xs">{subtext}</span>
      </div>
    </div>
    <div className={`p-3 rounded-lg ${colorClass}`}>
      <Icon size={24} />
    </div>
  </div>
);

const RegionBar = ({ state, count, total, color }) => (
  <div className="mb-4">
    <div className="flex justify-between text-sm mb-1">
      <span className="font-medium text-gray-700">{state}</span>
      <span className="text-gray-500">{count} Exceptions</span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div 
        className={`h-2 rounded-full ${color}`} 
        style={{ width: `${(count / total) * 100}%` }}
      ></div>
    </div>
  </div>
);

// --- Main Application ---

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [selectedTask, setSelectedTask] = useState(INITIAL_TASKS[0]);
  const [stats, setStats] = useState({
    total: 1248,
    aiResolved: 182, // ~14.5% 
    pending: 45,
    backlog: 1021
  });

  const handleApprove = (taskId) => {
    // Remove task from list and update stats
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setStats(prev => ({
      ...prev,
      total: prev.total - 1,
      aiResolved: prev.aiResolved + 1,
      pending: prev.pending - 1
    }));
    
    // Select next task if available
    const remaining = tasks.filter(t => t.id !== taskId);
    if (remaining.length > 0) setSelectedTask(remaining[0]);
    else setSelectedTask(null);
  };

  const handleEscalate = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setStats(prev => ({
      ...prev,
      pending: prev.pending - 1,
      backlog: prev.backlog + 1 // Move to manual backlog
    }));
    const remaining = tasks.filter(t => t.id !== taskId);
    if (remaining.length > 0) setSelectedTask(remaining[0]);
    else setSelectedTask(null);
  };

  const renderDashboard = () => (
    <div className="p-8 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Command Center</h1>
        <p className="text-gray-500">Real-time EVV exception monitoring and resolution.</p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Exceptions" 
          value={stats.total} 
          subtext="active tickets" 
          trend="+12%" 
          trendUp={false} 
          icon={AlertCircle} 
          colorClass="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="AI Resolved (Zero Touch)" 
          value={`${((stats.aiResolved / 1248) * 100).toFixed(1)}%`} 
          subtext={`${stats.aiResolved} tickets`} 
          trend="+4.5%" 
          trendUp={true} 
          icon={CheckCircle} 
          colorClass="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="Pending Human Review" 
          value={stats.pending} 
          subtext="needs attention" 
          trend="-2%" 
          trendUp={true} 
          icon={Users} 
          colorClass="bg-amber-100 text-amber-600" 
        />
        <StatCard 
          title="Backlog Size" 
          value={stats.backlog} 
          subtext="> 24 hours" 
          trend="-5%" 
          trendUp={true} 
          icon={Clock} 
          colorClass="bg-purple-100 text-purple-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Heatmap Section */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Map size={20} className="text-gray-500" />
              Regional Exception Heatmap
            </h2>
            <button className="text-sm text-blue-600 font-medium hover:underline">View Full Map</button>
          </div>
          <div className="space-y-6">
            <RegionBar state="Illinois (IL)" count={450} total={800} color="bg-blue-600" />
            <RegionBar state="Pennsylvania (PA)" count={320} total={800} color="bg-indigo-500" />
            <RegionBar state="New York (NY)" count={180} total={800} color="bg-blue-400" />
            <RegionBar state="Georgia (GA)" count={95} total={800} color="bg-blue-300" />
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
               <div className="w-3 h-3 rounded-full bg-red-500"></div>
               <span className="text-sm text-gray-600">Critical (GPS Mismatch)</span>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-3 h-3 rounded-full bg-amber-500"></div>
               <span className="text-sm text-gray-600">Warning (Missed Clock-out)</span>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity size={20} className="text-gray-500" />
            Live Inbound Feed
          </h2>
          <div className="space-y-4">
            {RECENT_ACTIVITY.map((activity) => (
              <div key={activity.id} className="flex gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <div className={`mt-1 min-w-[8px] h-2 rounded-full ${
                  activity.type === 'auto' ? 'bg-green-500' : 
                  activity.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'
                }`} />
                <div>
                  <p className="text-sm text-gray-800 leading-snug">{activity.text}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderResolutionWorkspace = () => (
    <div className="flex h-full bg-gray-50 overflow-hidden">
      {/* Task Queue (Left) */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-800 mb-1">Exception Queue</h2>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{tasks.length} tasks needing review</span>
            <span>Priority Order</span>
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {tasks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <CheckCircle size={48} className="mx-auto mb-3 text-green-500" />
              <p>All caught up! No pending exceptions.</p>
            </div>
          ) : (
            tasks.map(task => (
              <div 
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedTask?.id === task.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-gray-900 text-sm">{task.caregiver}</span>
                  <span className="text-xs text-gray-400">{task.time.split('•')[1]}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">{task.type}</span>
                  <span className="text-xs text-gray-500">{task.location}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">Client: {task.client}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Workspace (Middle & Right) */}
      {selectedTask ? (
        <div className="flex-1 flex">
          {/* Middle: Details & Controls */}
          <div className="w-1/2 p-6 overflow-y-auto">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold text-gray-500 tracking-wider uppercase">Ticket #{selectedTask.id}</span>
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-medium">Attention Required</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{selectedTask.type}</h1>
              <p className="text-gray-600">Client: <span className="font-medium">{selectedTask.client}</span></p>
            </div>

            {/* AI Insight Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-blue-600 text-white p-1 rounded">
                  <MessageSquare size={16} />
                </div>
                <h3 className="font-semibold text-blue-900">AI Resolution Proposal</h3>
                <span className="ml-auto text-xs font-bold text-blue-700 bg-blue-200 px-2 py-1 rounded">
                  {selectedTask.confidence}% Confidence
                </span>
              </div>
              <p className="text-sm text-blue-800 mb-4">
                Based on the conversation, the caregiver has confirmed the correct end time. The system recommends updating the timesheet.
              </p>
              
              <div className="bg-white rounded-lg p-3 border border-blue-100 mb-4 shadow-sm">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Suggested Action</p>
                <p className="font-medium text-gray-900">{selectedTask.ai_suggestion}</p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => handleApprove(selectedTask.id)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <ThumbsUp size={16} />
                  Approve & Close
                </button>
                <button 
                  onClick={() => handleEscalate(selectedTask.id)}
                  className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <MoreVertical size={16} />
                  Options
                </button>
              </div>
            </div>

            {/* Metadata */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-bold text-gray-900 mb-3">System Tags</h4>
              <div className="flex flex-wrap gap-2">
                {selectedTask.tags.map(tag => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: SMS Simulator */}
          <div className="w-1/2 bg-gray-100 border-l border-gray-200 flex flex-col">
            <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center shadow-sm">
              <div>
                <h3 className="font-bold text-gray-800">HeyMarket Integration</h3>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Active Session
                </p>
              </div>
              <button className="text-xs text-blue-600 hover:underline">View History</button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {selectedTask.chat_history.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'ai' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                    msg.sender === 'ai' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.sender === 'ai' ? 'text-blue-100' : 'text-gray-400'}`}>
                      {msg.sender === 'ai' ? 'AI Agent' : selectedTask.caregiver} • {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white border-t border-gray-200">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Type a manual message..." 
                  className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
                <button className="absolute right-2 top-2 p-1 text-blue-600 hover:bg-blue-50 rounded">
                  <Send size={18} />
                </button>
              </div>
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                <span className="text-xs whitespace-nowrap bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded cursor-pointer border border-gray-200">
                  Request GPS location
                </span>
                <span className="text-xs whitespace-nowrap bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded cursor-pointer border border-gray-200">
                  Send Timesheet PDF
                </span>
                <span className="text-xs whitespace-nowrap bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded cursor-pointer border border-gray-200">
                  Re-send Policy #404
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50 flex-col text-gray-400">
           <Search size={48} className="mb-4 opacity-50" />
           <p>Select a task to begin resolution</p>
        </div>
      )}
    </div>
  );

  const renderCompliance = () => (
    <div className="p-8">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance & Audit</h1>
          <p className="text-gray-500">Track "Re-education" frequency and high-risk caregivers.</p>
        </div>
        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
          Export Report
        </button>
      </header>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert size={20} className="text-amber-500" />
            High Frequency Offenders
          </h2>
          <p className="text-sm text-gray-500 mt-1">Caregivers triggering multiple EVV exceptions this month.</p>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 font-medium">Caregiver Name</th>
              <th className="px-6 py-3 font-medium">Total Offenses</th>
              <th className="px-6 py-3 font-medium">Most Common Issue</th>
              <th className="px-6 py-3 font-medium">Risk Level</th>
              <th className="px-6 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {COMPLIANCE_DATA.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{row.offenses}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs border border-gray-200">
                    {row.last_incident}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    row.risk === 'High' ? 'bg-red-100 text-red-700' : 
                    row.risk === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {row.risk} Risk
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Assign Training</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Resolution Source Audit</h3>
            <div className="flex items-center gap-4">
                <div className="w-32 h-32 rounded-full border-8 border-gray-100 border-l-green-500 border-t-green-500 rotate-45 transform"></div>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                        <span className="text-sm text-gray-600">Zero Touch (AI)</span>
                        <span className="font-bold text-gray-900">14.5%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-gray-200 rounded-full"></span>
                        <span className="text-sm text-gray-600">Human Assisted</span>
                        <span className="font-bold text-gray-900">85.5%</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 italic">Based on "0 vs 1 Assignee Station" data</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans text-gray-900">
      {/* Sidebar navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-10">
        <div className="p-6 flex items-center gap-2 border-b border-gray-100">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none tracking-tight">EVV<span className="text-blue-600">Guard</span></h1>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Admin Console</span>
          </div>
        </div>
        
        <nav className="flex-1 py-6 space-y-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeView === 'dashboard'} 
            onClick={() => setActiveView('dashboard')} 
          />
          <SidebarItem 
            icon={MessageSquare} 
            label="Resolution Desk" 
            active={activeView === 'workspace'} 
            onClick={() => setActiveView('workspace')}
            count={tasks.length}
          />
          <SidebarItem 
            icon={FileText} 
            label="Compliance Logs" 
            active={activeView === 'compliance'} 
            onClick={() => setActiveView('compliance')} 
          />
          <SidebarItem 
            icon={Users} 
            label="Caregivers" 
            active={false} 
            onClick={() => {}} 
          />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              CC
            </div>
            <div>
              <p className="text-sm font-medium">CTA Coord.</p>
              <p className="text-xs text-gray-400">Chicago Branch</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 px-8 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-4 text-gray-400">
                <Search size={20} />
                <span className="text-sm">Search tickets, caregivers, or clients...</span>
            </div>
            <div className="flex items-center gap-4">
                <button className="relative text-gray-500 hover:text-blue-600 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="h-8 w-px bg-gray-200 mx-2"></div>
                <button className="text-sm font-medium text-gray-600 hover:text-gray-900">Help & Support</button>
            </div>
        </header>

        {/* Dynamic View Content */}
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'workspace' && renderResolutionWorkspace()}
        {activeView === 'compliance' && renderCompliance()}
      </main>
    </div>
  );
}
