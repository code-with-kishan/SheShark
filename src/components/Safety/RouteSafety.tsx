import React, { useState } from 'react';
import { MapPin, AlertTriangle, MessageSquare, Send } from 'lucide-react';
import axios from 'axios';

interface RouteSafetyProps {
  fromLocation?: string;
  toLocation?: string;
}

/**
 * Route Safety Component
 * Community-driven route safety ratings and reporting
 */
export const RouteSafety: React.FC<RouteSafetyProps> = ({ fromLocation = '', toLocation = '' }) => {
  const [from, setFrom] = useState(fromLocation);
  const [to, setTo] = useState(toLocation);
  const [safetyScore, setSafetyScore] = useState<number | null>(null);
  const [ratings, setRatings] = useState<any[]>([]);
  const [userRating, setUserRating] = useState(3);
  const [userComment, setUserComment] = useState('');
  const [isLoadingRatings, setIsLoadingRatings] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRouteSafetyRatings = async () => {
    if (!from || !to) {
      alert('Please enter both locations');
      return;
    }

    setIsLoadingRatings(true);
    try {
      const response = await axios.get('/api/safety/route-safety', {
        params: { from, to },
      });

      setSafetyScore(response.data.averageSafetyScore);
      setRatings(response.data.ratings);
    } catch (error) {
      console.error('Error fetching route ratings:', error);
    } finally {
      setIsLoadingRatings(false);
    }
  };

  const submitRating = async () => {
    if (!from || !to) {
      alert('Please enter both locations');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(
        '/api/safety/route-safety',
        {
          from,
          to,
          safetyScore: userRating,
          comment: userComment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUserComment('');
      await fetchRouteSafetyRatings();
      alert('Thank you for rating this route!');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSafetyColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSafetyLabel = (score: number) => {
    if (score >= 4) return 'Very Safe';
    if (score >= 3) return 'Fairly Safe';
    return 'Use Caution';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <MapPin size={20} className="text-blue-500" />
        Route Safety Check
      </h3>

      {/* Location Inputs */}
      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="Starting location"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Destination"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        onClick={fetchRouteSafetyRatings}
        disabled={isLoadingRatings}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition mb-4"
      >
        {isLoadingRatings ? 'Checking...' : 'Check Safety'}
      </button>

      {/* Safety Score Display */}
      {safetyScore !== null && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600 mb-2">Community Safety Score</p>
          <div className="flex items-center gap-3">
            <div className="text-4xl font-bold text-blue-600">{safetyScore.toFixed(1)}</div>
            <div>
              <p className={`font-semibold ${getSafetyColor(safetyScore)}`}>
                {getSafetyLabel(safetyScore)}
              </p>
              <p className="text-xs text-gray-600">{ratings.length} ratings</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Ratings */}
      {ratings.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">Community Feedback</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {ratings.slice(0, 3).map((rating, i) => (
              <div key={i} className="bg-gray-50 p-2 rounded text-sm">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(rating.safetyScore)].map((_, j) => (
                    <span key={j} className="text-yellow-400">★</span>
                  ))}
                </div>
                {rating.comment && <p className="text-gray-700 text-xs">{rating.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rate This Route */}
      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-800 mb-3">Rate This Route</h4>

        <div className="mb-3">
          <label className="block text-sm text-gray-700 mb-2">Your Safety Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setUserRating(rating)}
                className={`text-2xl transition ${
                  rating <= userRating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <textarea
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            placeholder="Optional: Share your experience with this route"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            rows={3}
          />
        </div>

        <button
          onClick={submitRating}
          disabled={isSubmitting}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition flex items-center justify-center gap-2"
        >
          <Send size={16} />
          {isSubmitting ? 'Submitting...' : 'Submit Rating'}
        </button>
      </div>
    </div>
  );
};

export default RouteSafety;
