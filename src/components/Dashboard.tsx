import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [graduationStatus, setGraduationStatus] = useState<string>('pending');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const getProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
      setGraduationStatus(data.graduation_status || 'pending');
    };

    getProfile();
  }, [user, navigate]);

  const handleStatusUpdate = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({ graduation_status: 'confirmed' })
      .eq('id', user.id);

    if (!error) {
      setGraduationStatus('confirmed');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-4">Student Dashboard</h2>
                {profile && (
                  <>
                    <p>Welcome, {profile.full_name}</p>
                    <p>Email: {user.email}</p>
                    <p>Student ID: {profile.student_id}</p>
                    <p>Graduation Status: {graduationStatus}</p>
                    
                    {graduationStatus === 'pending' && (
                      <button
                        onClick={handleStatusUpdate}
                        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                      >
                        Confirm Graduation Attendance
                      </button>
                    )}
                    
                    <button
                      onClick={handleSignOut}
                      className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;