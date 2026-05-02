import React, { useContext, useState } from 'react';
import { Heart, Calendar, MapPin } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const FoodItemCard = ({ item }) => {
  const { user, setFoodItems } = useContext(AuthContext);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestFeedback, setRequestFeedback] = useState('');
  const food = item || {};

  const formattedDate = food.expiryDate ? new Date(food.expiryDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'N/A';

  const title = food.title || food.name || 'Untitled';
  const description = food.description || '';
  const location = food.location || 'Unknown';
  const donorName = food.donorName || 'Anonymous';
  const donorAvatar = food.donorAvatar || '/default-avatar.png';
  const id = food.id || '';

  const canRequest = user && food.status === 'available' && food.donorId !== user.id;
  const canRespond = user && food.status === 'requested' && food.donorId === user.id;
  const isRequester = user && food.status === 'requested' && food.requestedBy === user.id;

  const handleRequest = async () => {
    if (!canRequest) return;
    if (!window.confirm('Do you want to request this food item?')) return;

    setIsRequesting(true);
    setRequestFeedback('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/food-items/${id}/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        setRequestFeedback(err.error || 'Failed to request food item');
      } else {
        const updated = await response.json();
        setRequestFeedback('Request sent! Waiting for donor response.');
        setFoodItems(prev => prev.map(i => (i.id === updated.id ? updated : i)));
      }
    } catch (err) {
      setRequestFeedback('Failed to request food item');
      console.error('Request food error', err);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleRespond = async (action) => {
    if (!canRespond) return;
    setRequestFeedback('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/food-items/${id}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        setRequestFeedback(err.error || 'Failed to respond to request');
      } else {
        const updated = await response.json();
        setFoodItems(prev => prev.map(i => (i.id === updated.id ? updated : i)));
        setRequestFeedback(action === 'accept' ? 'Request accepted' : 'Request rejected');
      }
    } catch (err) {
      setRequestFeedback('Failed to respond to request');
      console.error('Respond food error', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        <button 
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Add to favorites"
        >
          <Heart size={20} />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={16} className="mr-2" />
          <span>Expires: {formattedDate}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin size={16} className="mr-2" />
          <span>{location}</span>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={donorAvatar}
            alt="Donor"
            className="w-8 h-8 rounded-full"
          />
          <span className="ml-2 text-sm text-gray-700">{donorName}</span>
        </div>
        <div className="text-right">
              {canRequest && (
            <>
              <button
                onClick={handleRequest}
                disabled={isRequesting}
                className="btn-primary text-sm"
              >
                {isRequesting ? 'Requesting...' : 'Request Food'}
              </button>
              {requestFeedback && (
                <p className="text-xs text-blue-600 mt-1">{requestFeedback}</p>
              )}
            </>
          )}

          {canRespond && (
            <div className="space-y-2 w-full">
              <p className="text-sm text-gray-600">This item has been requested (respond as donor):</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRespond('accept')}
                  className="flex-1 btn-primary"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRespond('reject')}
                  className="flex-1 btn-outline"
                >
                  Reject
                </button>
              </div>
            </div>
          )}

          {isRequester && !canRespond && (
            <div className="text-center">
              <p className="text-sm text-gray-600">Your request is sent. Waiting for donor response...</p>
            </div>
          )}

          {!canRequest && !canRespond && !isRequester && food.status === 'available' && (
            <span className="text-sm text-gray-500">Not available for request</span>
          )}

          {food.status === 'claimed' && !canRespond && (
            <span className="text-sm text-green-600">Claimed</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItemCard;
