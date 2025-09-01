import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Gamepad2, 
  DollarSign, 
  Settings, 
  Shield, 
  TrendingUp,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  Crown,
  Activity
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalGames: number;
  totalRevenue: number;
  totalPayouts: number;
  profit: number;
  pendingWithdrawals: number;
  reportedUsers: number;
}

interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  totalGames: number;
  totalWinnings: number;
  isVerified: boolean;
  isVIP: boolean;
  isBanned: boolean;
  lastActive: Date;
  joinDate: Date;
}

interface Game {
  id: string;
  roomId: string;
  playerCount: number;
  entryFee: number;
  prizePool: number;
  houseProfit: number;
  startTime: Date;
  endTime: Date;
  status: 'active' | 'completed' | 'cancelled';
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 1247,
    activeUsers: 89,
    totalGames: 3456,
    totalRevenue: 45678.90,
    totalPayouts: 31976.23,
    profit: 13702.67,
    pendingWithdrawals: 2345.67,
    reportedUsers: 12
  });

  const [users, setUsers] = useState<User[]>([
    {
      id: 'user_1',
      username: 'BingoMaster2024',
      email: 'bingo@example.com',
      balance: 1250.75,
      totalGames: 156,
      totalWinnings: 3450.25,
      isVerified: true,
      isVIP: true,
      isBanned: false,
      lastActive: new Date(),
      joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'user_2',
      username: 'LuckyPlayer',
      email: 'lucky@example.com',
      balance: 89.50,
      totalGames: 23,
      totalWinnings: 450.00,
      isVerified: true,
      isVIP: false,
      isBanned: false,
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      joinDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'user_3',
      username: 'SuspiciousUser',
      email: 'suspicious@example.com',
      balance: 0.00,
      totalGames: 5,
      totalWinnings: 0.00,
      isVerified: false,
      isVIP: false,
      isBanned: true,
      lastActive: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      joinDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [games, setGames] = useState<Game[]>([
    {
      id: 'game_1',
      roomId: 'room-4',
      playerCount: 20,
      entryFee: 30.00,
      prizePool: 600.00,
      houseProfit: 180.00,
      startTime: new Date(Date.now() - 30 * 60 * 1000),
      endTime: new Date(Date.now() - 10 * 60 * 1000),
      status: 'completed'
    },
    {
      id: 'game_2',
      roomId: 'room-2',
      playerCount: 10,
      entryFee: 20.00,
      prizePool: 200.00,
      houseProfit: 60.00,
      startTime: new Date(Date.now() - 15 * 60 * 1000),
      endTime: new Date(Date.now() - 5 * 60 * 1000),
      status: 'completed'
    },
    {
      id: 'game_3',
      roomId: 'room-1',
      playerCount: 5,
      entryFee: 15.00,
      prizePool: 75.00,
      houseProfit: 22.50,
      startTime: new Date(),
      endTime: new Date(Date.now() + 2 * 60 * 1000),
      status: 'active'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'verified' && user.isVerified) ||
                         (filterStatus === 'vip' && user.isVIP) ||
                         (filterStatus === 'banned' && user.isBanned);
    
    return matchesSearch && matchesFilter;
  });

  const handleBanUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isBanned: true } : user
    ));
  };

  const handleUnbanUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isBanned: false } : user
    ));
  };

  const handleToggleVIP = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isVIP: !user.isVIP } : user
    ));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">🔧 Admin Panel</h1>
            <p className="text-white/80">Manage your BetBingoCash platform</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-green-600 px-4 py-2 rounded-lg">
              <span className="text-white font-bold">Live Platform</span>
            </div>
            <div className="text-white/60">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white/10 rounded-lg p-1 mb-6">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'games', label: 'Games', icon: Gamepad2 },
            { id: 'finance', label: 'Finance', icon: DollarSign },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{stats.totalUsers}</h3>
                    <p className="text-white/60 text-sm">Total Users</p>
                  </div>
                </div>
                <div className="mt-3 text-green-400 text-sm">+12% this week</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Gamepad2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{stats.totalGames}</h3>
                    <p className="text-white/60 text-sm">Total Games</p>
                  </div>
                </div>
                <div className="mt-3 text-green-400 text-sm">+8% this week</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{formatCurrency(stats.profit)}</h3>
                    <p className="text-white/60 text-sm">Total Profit</p>
                  </div>
                </div>
                <div className="mt-3 text-green-400 text-sm">+15% this week</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{stats.reportedUsers}</h3>
                    <p className="text-white/60 text-sm">Reported Users</p>
                  </div>
                </div>
                <div className="mt-3 text-red-400 text-sm">+2 this week</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-xl mb-4">📊 Recent Activity</h3>
              <div className="space-y-3">
                {games.slice(0, 5).map(game => (
                  <div key={game.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        game.status === 'active' ? 'bg-green-500' :
                        game.status === 'completed' ? 'bg-blue-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-white">Game {game.id} completed</span>
                    </div>
                    <div className="text-white/60 text-sm">
                      {formatCurrency(game.houseProfit)} profit
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search users by username or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                >
                  <option value="all">All Users</option>
                  <option value="verified">Verified Only</option>
                  <option value="vip">VIP Only</option>
                  <option value="banned">Banned Only</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/10">
                    <tr>
                      <th className="px-6 py-3 text-left text-white font-bold">User</th>
                      <th className="px-6 py-3 text-left text-white font-bold">Balance</th>
                      <th className="px-6 py-3 text-left text-white font-bold">Games</th>
                      <th className="px-6 py-3 text-left text-white font-bold">Winnings</th>
                      <th className="px-6 py-3 text-left text-white font-bold">Status</th>
                      <th className="px-6 py-3 text-left text-white font-bold">Last Active</th>
                      <th className="px-6 py-3 text-left text-white font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-white/5">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-white font-medium">{user.username}</div>
                            <div className="text-white/60 text-sm">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-white">{formatCurrency(user.balance)}</td>
                        <td className="px-6 py-4 text-white">{user.totalGames}</td>
                        <td className="px-6 py-4 text-white">{formatCurrency(user.totalWinnings)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {user.isVerified && (
                              <span className="bg-green-600 px-2 py-1 rounded text-xs text-white">Verified</span>
                            )}
                            {user.isVIP && (
                              <span className="bg-yellow-600 px-2 py-1 rounded text-xs text-white">VIP</span>
                            )}
                            {user.isBanned && (
                              <span className="bg-red-600 px-2 py-1 rounded text-xs text-white">Banned</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-white/60 text-sm">
                          {user.lastActive.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-white/10 rounded">
                              <Eye className="w-4 h-4 text-blue-400" />
                            </button>
                            
                            {user.isBanned ? (
                              <button 
                                onClick={() => handleUnbanUser(user.id)}
                                className="p-1 hover:bg-white/10 rounded"
                              >
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleBanUser(user.id)}
                                className="p-1 hover:bg-white/10 rounded"
                              >
                                <Ban className="w-4 h-4 text-red-400" />
                              </button>
                            )}
                            
                            <button 
                              onClick={() => handleToggleVIP(user.id)}
                              className="p-1 hover:bg-white/10 rounded"
                            >
                              <Crown className={`w-4 h-4 ${user.isVIP ? 'text-yellow-400' : 'text-gray-400'}`} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Games Tab */}
        {activeTab === 'games' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/10">
                    <tr>
                      <th className="px-6 py-3 text-left text-white font-bold">Game ID</th>
                      <th className="px-6 py-3 text-left text-white font-bold">Room</th>
                      <th className="px-6 py-3 text-left text-white font-bold">Players</th>
                      <th className="px-6 py-3 text-left text-white font-bold">Entry Fee</th>
                      <th className="px-6 py-3 text-left text-white font-bold">Prize Pool</th>
                      <th className="px-6 py-3 text-left text-white font-bold">Profit</th>
                      <th className="px-6 py-3 text-left text-white font-bold">Status</th>
                      <th className="px-6 py-3 text-left text-white font-bold">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {games.map(game => (
                      <tr key={game.id} className="hover:bg-white/5">
                        <td className="px-6 py-4 text-white font-mono">{game.id}</td>
                        <td className="px-6 py-4 text-white">{game.roomId}</td>
                        <td className="px-6 py-4 text-white">{game.playerCount}</td>
                        <td className="px-6 py-4 text-white">{formatCurrency(game.entryFee)}</td>
                        <td className="px-6 py-4 text-white">{formatCurrency(game.prizePool)}</td>
                        <td className="px-6 py-4 text-green-400 font-bold">{formatCurrency(game.houseProfit)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            game.status === 'active' ? 'bg-green-600 text-white' :
                            game.status === 'completed' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'
                          }`}>
                            {game.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white/60 text-sm">
                          {formatDate(game.startTime)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Finance Tab */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-white font-bold text-xl mb-4">💰 Revenue Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-white/80">Total Revenue:</span>
                    <span className="text-white font-bold">{formatCurrency(stats.totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Total Payouts:</span>
                    <span className="text-white font-bold">{formatCurrency(stats.totalPayouts)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Net Profit:</span>
                    <span className="text-green-400 font-bold">{formatCurrency(stats.profit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Profit Margin:</span>
                    <span className="text-green-400 font-bold">
                      {((stats.profit / stats.totalRevenue) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-white font-bold text-xl mb-4">📊 Pending Transactions</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-white/80">Pending Withdrawals:</span>
                    <span className="text-yellow-400 font-bold">{formatCurrency(stats.pendingWithdrawals)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Today's Games:</span>
                    <span className="text-white font-bold">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Active Players:</span>
                    <span className="text-white font-bold">{stats.activeUsers}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-xl mb-4">🛡️ Security Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">🔒</div>
                  <div className="text-white font-bold">Account Security</div>
                  <div className="text-green-400 text-sm">All systems secure</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🚫</div>
                  <div className="text-white font-bold">Banned Users</div>
                  <div className="text-red-400 text-sm">{users.filter(u => u.isBanned).length} accounts</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">⚠️</div>
                  <div className="text-white font-bold">Reported Issues</div>
                  <div className="text-yellow-400 text-sm">{stats.reportedUsers} pending</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-xl mb-4">⚙️ Platform Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Maintenance Mode</span>
                  <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
                    Disabled
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">New User Registration</span>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                    Enabled
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Crypto Withdrawals</span>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                    Enabled
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel; 