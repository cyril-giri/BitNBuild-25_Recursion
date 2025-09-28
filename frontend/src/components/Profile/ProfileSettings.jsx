import React from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function ProfileSettings() {
  const navigate = useNavigate();

  const handleUpdatePassword = async () => {
    const email = supabase.auth.user()?.email;
    if (email) {
      const { error } = await supabase.auth.api.resetPasswordForEmail(email);
      if (error) {
        alert("Error sending password reset email: " + error.message);
      } else {
        alert("Password reset email sent! Please check your inbox.");
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("ARE YOU SURE? This action is irreversible and will permanently delete your account, projects, bids, and contracts.")) {
      if (window.confirm("Please confirm one last time. There is no going back.")) {
        // For this to work safely, you should create a Supabase Database Function
        // called 'delete_user_account' that handles the cascading deletes securely.
        const { error } = await supabase.rpc('delete_user_account'); 
        if (error) {
          alert("Error deleting account: " + error.message);
        } else {
          alert("Your account has been deleted.");
          await supabase.auth.signOut();
          navigate('/');
        }
      }
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white">Account Settings</h3>
        <p className="text-sm text-neutral-400">Manage your account preferences and security.</p>
      </div>

      <div className="border-t border-neutral-800 pt-4">
        <h4 className="font-semibold text-white">Update Password</h4>
        <p className="text-sm text-neutral-400 mt-1">
          A password reset link will be sent to your email address.
        </p>
        <button
          onClick={handleUpdatePassword}
          className="mt-2 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-2 px-4 rounded-lg text-sm"
        >
          Send Reset Link
        </button>
      </div>

      <div className="border-t border-red-900/50 pt-4">
        <h4 className="font-semibold text-red-400">Danger Zone</h4>
        <p className="text-sm text-neutral-400 mt-1">
          Deleting your account is permanent. All of your data will be removed.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="mt-2 bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm"
        >
          Delete My Account
        </button>
      </div>
    </div>
  );
}