import { useContext, useState, useEffect } from 'react';
import { User, Gift, Heart, Calendar, MapPin } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import FoodItemCard from './FoodItemCard';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('donated');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load profile data</p>
      </div>
    );
  }

  const { user: profileUser, donatedItems, requestedItems } = profileData;

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="bg-primary-100 p-3 rounded-full">
            <User className="h-8 w-8 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{profileUser.username}</h1>
            <p className="text-gray-600">{profileUser.email}</p>
            <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
              <MapPin className="h-4 w-4" />
              <span>{profileUser.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">{profileUser.donationsCount}</div>
          <div className="text-sm text-gray-600">Items Donated</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-secondary-600">{profileUser.receivedCount}</div>
          <div className="text-sm text-gray-600">Items Received</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{donatedItems.length}</div>
          <div className="text-sm text-gray-600">Total Shared</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{requestedItems.length}</div>
          <div className="text-sm text-gray-600">Total Requests</div>
        </div>
      </div>

      {/* Activity Tabs */}
      <div className="card">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('donated')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'donated'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Gift className="h-4 w-4" />
                <span>Donated Items ({donatedItems.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('requested')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'requested'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>Requested Items ({requestedItems.length})</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'donated' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Items You've Shared</h3>
              {donatedItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {donatedItems.map(item => (
                    <FoodItemCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No items shared yet</h3>
                  <p className="text-gray-500">Start sharing food with your community!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'requested' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Items You've Requested</h3>
              {requestedItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {requestedItems.map(item => (
                    <FoodItemCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No requests yet</h3>
                  <p className="text-gray-500">Browse available items and make your first request!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Community Impact */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Community Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-primary-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Gift className="h-6 w-6 text-primary-600" />
              <h4 className="font-medium text-primary-900">Food Waste Reduced</h4>
            </div>
            <p className="text-sm text-primary-800">
              You've helped prevent {profileUser.donationsCount} food items from going to waste
            </p>
          </div>
          <div className="bg-secondary-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Heart className="h-6 w-6 text-secondary-600" />
              <h4 className="font-medium text-secondary-900">Community Support</h4>
            </div>
            <p className="text-sm text-secondary-800">
              You've received {profileUser.receivedCount} items from generous community members
            </p>
          </div>
        </div>
      </div>

      {/* Member Since */}
      <div className="card">
        <div className="flex items-center space-x-3">
          <Calendar className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">Member since</p>
            <p className="font-medium text-gray-900">
              {new Date(profileUser.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 