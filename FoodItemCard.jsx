import { useContext, useState } from 'react';
import { format } from 'date-fns';
import { Heart, MapPin, Clock, User, Edit, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const FoodItemCard = ({ item }) => {
  const { user, socket, setFoodItems } = useContext(AuthContext);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...item });
  const [isDeleting, setIsDeleting] = useState(false);
  const [requestFeedback, setRequestFeedback] = useState("");

  const handleRequest = async () => {
    if (!user) return;
    if (!window.confirm('Do you want to request this food item?')) return;
    setIsRequesting(true);
    setRequestFeedback("");
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/food-items/${item.id}/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setRequestFeedback("Request sent! Waiting for donor response.");
      } else {
        const errorData = await response.json().catch(() => ({}));
        setRequestFeedback(errorData.error || 'Failed to request food item');
      }
    } catch (error) {
      setRequestFeedback('Failed to request food item');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleRespond = async (action) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3001/api/food-items/${item.id}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
    } catch (error) {
      alert('Failed to respond to request');
    }
  };

  const handleEdit = () => {
    setEditData({ ...item });
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/food-items/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });
      if (response.ok) {
        const updated = await response.json();
        setFoodItems(prev => prev.map(f => f.id === updated.id ? updated : f));
        setIsEditing(false);
      } else {
        alert('Failed to update food item');
      }
    } catch (error) {
      alert('Failed to update food item');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this food item?')) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/food-items/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setFoodItems(prev => prev.filter(f => f.id !== item.id));
      } else {
        alert('Failed to delete food item');
      }
    } catch (error) {
      alert('Failed to delete food item');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = () => {
    const baseClasses = "status-badge";
    switch (item.status) {
      case 'available':
        return <span className={`${baseClasses} status-available`}>Available</span>;
      case 'requested':
        return <span className={`${baseClasses} status-requested`}>Requested</span>;
      case 'claimed':
        return <span className={`${baseClasses} status-claimed`}>Claimed</span>;
      default:
        return null;
    }
  };

  const canRequest = user && item.status === 'available' && item.donorId !== user.id;
  const canRespond = user && item.status === 'requested' && item.donorId === user.id;
  const isRequester = user && item.requestedBy === user.id;
  const isDonor = user && item.donorId === user.id;

  return (
    <div className="card hover:shadow-md transition-shadow duration-200 relative">
      <div className="relative">
        <img 
          src={item.imageUrl} 
          alt={item.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <div className="absolute top-2 right-2">
          {getStatusBadge()}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
        <p className="text-gray-600 text-sm">{item.description}</p>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>Expires {format(new Date(item.expiryDate), 'MMM dd')}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <User className="h-4 w-4" />
          <span>Shared by {item.donorName}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-primary-600">
            Quantity: {item.quantity}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-100 space-y-2">
          {canRequest && (
            <>
              <button
                onClick={handleRequest}
                disabled={isRequesting}
                className="w-full btn-primary"
              >
                {isRequesting ? 'Requesting...' : 'Request This Food'}
              </button>
              {requestFeedback && (
                <div className="text-sm text-blue-600 text-center mt-2">{requestFeedback}</div>
              )}
            </>
          )}

          {canRespond && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Requested by {item.requestedByName}
              </p>
              <div className="flex space-x-2">
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
                  Decline
                </button>
              </div>
            </div>
          )}

          {isRequester && item.status === 'requested' && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Waiting for donor to respond...
              </p>
            </div>
          )}

          {item.status === 'claimed' && (
            <div className="text-center">
              <p className="text-sm text-green-600 font-medium">
                ✓ Successfully shared!
              </p>
            </div>
          )}

          {/* Edit/Delete for donor */}
          {isDonor && (
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="btn-outline flex-1 flex items-center justify-center"
                title="Edit"
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </button>
              <button
                onClick={handleDelete}
                className="btn-outline flex-1 flex items-center justify-center text-red-600 border-red-400 hover:bg-red-50"
                disabled={isDeleting}
                title="Delete"
              >
                <Trash2 className="h-4 w-4 mr-1" /> {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setIsEditing(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Food Item</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                name="title"
                value={editData.title}
                onChange={handleEditChange}
                className="input-field"
                placeholder="Title"
                required
              />
              <textarea
                name="description"
                value={editData.description}
                onChange={handleEditChange}
                className="input-field"
                placeholder="Description"
                required
              />
              <input
                name="quantity"
                value={editData.quantity}
                onChange={handleEditChange}
                className="input-field"
                placeholder="Quantity"
                required
              />
              <input
                name="expiryDate"
                type="date"
                value={editData.expiryDate}
                onChange={handleEditChange}
                className="input-field"
                required
              />
              <input
                name="location"
                value={editData.location}
                onChange={handleEditChange}
                className="input-field"
                placeholder="Location"
                required
              />
              <input
                name="imageUrl"
                value={editData.imageUrl}
                onChange={handleEditChange}
                className="input-field"
                placeholder="Image URL"
              />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">Save</button>
                <button type="button" className="btn-outline flex-1" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodItemCard; 