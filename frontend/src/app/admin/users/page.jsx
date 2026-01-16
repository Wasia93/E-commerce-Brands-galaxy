'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import { Users, Mail, Phone, Shield, ShieldOff, Search } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-gold">Users</h1>
        <p className="text-gray-400 mt-1">Manage registered users</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" size={20} />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-luxury-darkGray border border-gold/20 rounded-lg text-white focus:border-gold outline-none"
        />
      </div>

      {users.length === 0 ? (
        <div className="bg-luxury-darkGray rounded-lg border border-gold/20 p-12 text-center">
          <Users size={48} className="mx-auto text-gray-500 mb-4" />
          <p className="text-gray-400">No users found</p>
          <p className="text-gray-500 text-sm mt-1">Users will appear here when they register</p>
        </div>
      ) : (
        <div className="bg-luxury-darkGray rounded-lg overflow-hidden border border-gold/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-luxury-lightGray">
                <tr>
                  <th className="px-6 py-3 text-left text-gold">User</th>
                  <th className="px-6 py-3 text-left text-gold">Contact</th>
                  <th className="px-6 py-3 text-left text-gold">Role</th>
                  <th className="px-6 py-3 text-left text-gold">Status</th>
                  <th className="px-6 py-3 text-left text-gold">Joined</th>
                  <th className="px-6 py-3 text-left text-gold">Last Login</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t border-gold/10">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                          <span className="text-gold font-medium">
                            {user.full_name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.full_name}</p>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Mail size={14} />
                          <span className="text-sm">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-gray-300">
                            <Phone size={14} />
                            <span className="text-sm">{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.is_admin ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold/20 text-gold rounded-full text-sm">
                          <Shield size={14} />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm">
                          <ShieldOff size={14} />
                          Customer
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        user.is_active
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {formatDate(user.last_login)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No users match your search
            </div>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-luxury-darkGray rounded-lg p-6 border border-gold/20">
          <p className="text-gray-400 text-sm">Total Users</p>
          <p className="text-3xl font-bold text-white mt-1">{users.length}</p>
        </div>
        <div className="bg-luxury-darkGray rounded-lg p-6 border border-gold/20">
          <p className="text-gray-400 text-sm">Active Users</p>
          <p className="text-3xl font-bold text-green-500 mt-1">
            {users.filter(u => u.is_active).length}
          </p>
        </div>
        <div className="bg-luxury-darkGray rounded-lg p-6 border border-gold/20">
          <p className="text-gray-400 text-sm">Admin Users</p>
          <p className="text-3xl font-bold text-gold mt-1">
            {users.filter(u => u.is_admin).length}
          </p>
        </div>
      </div>
    </div>
  );
}
