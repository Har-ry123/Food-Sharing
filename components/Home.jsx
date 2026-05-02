import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Gift, TrendingUp, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import FoodItemCard from './FoodItemCard';

const Home = () => {
  const { user, foodItems, stats } = useContext(AuthContext);

  const featuredItems = foodItems
    .filter(item => item.status === 'available')
    .slice(0, 6);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center mb-6">
            <Heart className="h-16 w-16 text-primary-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Share Food, Build Community
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with your neighbors, reduce food waste, and help those in need. 
            SharePlate makes it easy to give and receive food in your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/add-food" className="btn-primary text-lg px-8 py-3">
                Share Food Now
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-lg px-8 py-3">
                  Get Started
                </Link>
                <Link to="/login" className="btn-outline text-lg px-8 py-3">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <Users className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers || 0}</h3>
          <p className="text-gray-600">Community Members</p>
        </div>
        <div className="card text-center">
          <Gift className="h-8 w-8 text-secondary-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalDonations || 0}</h3>
          <p className="text-gray-600">Successful Donations</p>
        </div>
        <div className="card text-center">
          <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">{stats.activeItems || 0}</h3>
          <p className="text-gray-600">Available Items</p>
        </div>
        <div className="card text-center">
          <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalFoodItems || 0}</h3>
          <p className="text-gray-600">Total Items Shared</p>
        </div>
      </section>

      {/* Featured Items */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Recent Food Items</h2>
          {user && (
            <Link to="/dashboard" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors">
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
        
        {featuredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map(item => (
              <FoodItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No food items available</h3>
            <p className="text-gray-500">Be the first to share food in your community!</p>
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="bg-white rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Share Food</h3>
            <p className="text-gray-600">
              Post your excess food items with photos and details about quantity and expiry date.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-secondary-600">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect</h3>
            <p className="text-gray-600">
              Browse available items in your area and request the ones you need.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Meet & Share</h3>
            <p className="text-gray-600">
              Arrange pickup and build meaningful connections with your neighbors.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 