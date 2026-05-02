import { useContext, useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import FoodItemCard from './FoodItemCard';

const Dashboard = () => {
  const { user, foodItems } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const availableItems = foodItems.filter(item => item.status === 'available');
  const requestedItems = foodItems.filter(item => item.status === 'requested');
  const claimedItems = foodItems.filter(item => item.status === 'claimed');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Food Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Browse and manage food items in your community
          </p>
        </div>
        <Link to="/add-food" className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Share Food</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">{availableItems.length}</div>
          <div className="text-sm text-gray-600">Available Items</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-secondary-600">{requestedItems.length}</div>
          <div className="text-sm text-gray-600">Pending Requests</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{claimedItems.length}</div>
          <div className="text-sm text-gray-600">Successfully Shared</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{foodItems.length}</div>
          <div className="text-sm text-gray-600">Total Items</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search food items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field pl-10"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="requested">Requested</option>
              <option value="claimed">Claimed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Food Items Grid */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredItems.length} Food Item{filteredItems.length !== 1 ? 's' : ''}
          </h2>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Clear search
            </button>
          )}
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <FoodItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {searchTerm ? 'No items found' : 'No food items available'}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? 'Try adjusting your search terms or filters'
                : 'Be the first to share food in your community!'
              }
            </p>
            {!searchTerm && (
              <Link to="/add-food" className="btn-primary mt-4 inline-flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Share Food</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 