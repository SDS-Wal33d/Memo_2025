import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, updateGraduationStatus } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [graduationStatus, setGraduationStatus] = useState<string>('pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const getProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setProfile(data);
        setGraduationStatus(data.graduation_status || 'pending');
      } catch (error: any) {
        console.error('Error fetching profile:', error.message);
        setError('Failed to load profile data');
      }
    };

    getProfile();
  }, [user, navigate]);

  const handleStatusUpdate = async () => {
    setLoading(true);
    setError('');
    
    try {
      await updateGraduationStatus(user.id, 'confirmed');
      setGraduationStatus('confirmed');
    } catch (error: any) {
      setError('Failed to update graduation status');
      console.error('Error updating status:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-4">Student Dashboard</h2>
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold">Welcome, {profile.full_name}</p>
                  <p>Email: {profile.email}</p>
                  <p>Student ID: {profile.student_id}</p>
                  <p className="mt-2">
                    Graduation Status: 
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      graduationStatus === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {graduationStatus}
                    </span>
                  </p>
                </div>
                
                {graduationStatus === 'pending' && (
                  <button
                    onClick={handleStatusUpdate}
                    disabled={loading}
                    className={`mt-4 w-full ${
                      loading 
                        ? 'bg-indigo-400' 
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    } text-white px-4 py-2 rounded transition duration-150 ease-in-out`}
                  >
                    {loading ? 'Confirming...' : 'Confirm Graduation Attendance'}
                  </button>
                )}
                
                <button
                  onClick={handleSignOut}
                  className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-150 ease-in-out"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;