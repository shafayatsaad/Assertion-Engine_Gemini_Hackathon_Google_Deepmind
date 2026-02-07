import React, { useState } from 'react';
import { User, Mail, Lock, Briefcase, Building2, Save, Loader2, ArrowLeft, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../AppContext';
import { MobileNav } from './MobileNav';
import { ProfileDropdown } from './ProfileDropdown';

interface ProfileSettingsProps {
  onNavigate: (page: 'dashboard') => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onNavigate }) => {
  const { user, updateUser } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    title: user?.title || '',
    institution: user?.institution || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate password change if provided
      if (formData.newPassword) {
        if (formData.newPassword.length < 6) {
          throw new Error('New password must be at least 6 characters');
        }
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (!formData.currentPassword) {
          throw new Error('Current password is required to change password');
        }
      }

      // Update profile
      await updateUser({
        name: formData.name,
        email: formData.email,
        title: formData.title,
        institution: formData.institution
      });

      setSuccess('Profile updated successfully!');
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err: any) {
      console.error('Update error:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between gap-2 text-slate-400 hover:text-white transition-colors mb-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Dashboard</span>
            </button>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMobileNavOpen(true)}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white md:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              <ProfileDropdown onNavigate={onNavigate} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-slate-400">Manage your account information and preferences</p>
        </motion.div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 rounded-2xl border border-white/10"
        >
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-400" />
                Basic Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="glass-input w-full rounded-xl pl-11 pr-4 py-3 text-sm text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Title</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Researcher"
                        className="glass-input w-full rounded-xl pl-11 pr-4 py-3 text-sm text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Institution</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={formData.institution}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                        placeholder="e.g., Research Institute"
                        className="glass-input w-full rounded-xl pl-11 pr-4 py-3 text-sm text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Change */}
            <div className="pt-6 border-t border-white/10">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-cyan-400" />
                Change Password
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Current Password</label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">New Password</label>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      placeholder="Minimum 6 characters"
                      minLength={6}
                      className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Confirm Password</label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Re-enter new password"
                      className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white"
                    />
                  </div>
                </div>
                
                <p className="text-xs text-slate-500">
                  Leave password fields empty if you don't want to change your password
                </p>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20"
              >
                <p className="text-sm text-rose-400">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
              >
                <p className="text-sm text-emerald-400">{success}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>

      <MobileNav 
        isOpen={isMobileNavOpen} 
        onClose={() => setIsMobileNavOpen(false)} 
        onNavigate={onNavigate}
        currentPage="profile"
      />
    </div>
  );
};
