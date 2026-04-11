import React, { useState, useEffect } from 'react';
import { Heart, TrendingUp, Calendar } from 'lucide-react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const moodScores: Record<'great' | 'good' | 'okay' | 'bad' | 'terrible', number> = {
  great: 5,
  good: 4,
  okay: 3,
  bad: 2,
  terrible: 1,
};

/**
 * Mood Tracker Component
 * Track daily mood and view mood history trends
 */
export const MoodTracker: React.FC = () => {
  const [mood, setMood] = useState<'great' | 'good' | 'okay' | 'bad' | 'terrible' | null>(null);
  const [notes, setNotes] = useState('');
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moods = [
    { value: 'great' as const, emoji: '😄', label: 'Great' },
    { value: 'good' as const, emoji: '😊', label: 'Good' },
    { value: 'okay' as const, emoji: '😐', label: 'Okay' },
    { value: 'bad' as const, emoji: '😔', label: 'Bad' },
    { value: 'terrible' as const, emoji: '😢', label: 'Terrible' },
  ];

  const fetchMoodHistory = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get('/api/health/mood-history', {
        headers: { Authorization: `Bearer ${token}` },
        params: { days: 30 },
      });

      setMoodHistory(response.data.entries);
      setStatistics(response.data.statistics);
    } catch (error) {
      console.error('Error fetching mood history:', error);
    }
  };

  const recordMood = async () => {
    if (!mood) {
      alert('Please select a mood');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('auth_token');
      await axios.post(
        '/api/health/mood',
        { mood, notes: notes || undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMood(null);
      setNotes('');
      await fetchMoodHistory();
      alert('Mood recorded successfully! 📊');
    } catch (error) {
      console.error('Error recording mood:', error);
      alert('Failed to record mood');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  const getMoodColor = (moodValue: string) => {
    const colors: Record<string, string> = {
      great: 'bg-green-100 border-green-300',
      good: 'bg-blue-100 border-blue-300',
      okay: 'bg-yellow-100 border-yellow-300',
      bad: 'bg-orange-100 border-orange-300',
      terrible: 'bg-red-100 border-red-300',
    };
    return colors[moodValue] || 'bg-gray-100';
  };

  const chartData = moodHistory
    .slice(-7)
    .map((entry) => ({
      date: new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: moodScores[entry.mood as keyof typeof moodScores] || 0,
    }));

  return (
    <div className="space-y-6">
      {/* Record Mood */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Heart size={20} className="text-pink-500" />
          How are you feeling today?
        </h3>

        <div className="grid grid-cols-5 gap-2 mb-4">
          {moods.map(({ value, emoji, label }) => (
            <button
              key={value}
              onClick={() => setMood(value)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition ${
                mood === value
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl mb-1">{emoji}</span>
              <span className="text-xs font-medium text-gray-700">{label}</span>
            </button>
          ))}
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional: Share what's on your mind..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 mb-3 text-sm"
          rows={3}
        />

        <button
          onClick={recordMood}
          disabled={!mood || isSubmitting}
          className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 disabled:bg-gray-400 transition font-medium"
        >
          {isSubmitting ? 'Saving...' : 'Save My Mood'}
        </button>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-500" />
            Mood Insights
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-1">Total Check-ins</p>
              <p className="text-2xl font-bold text-green-600">{statistics.totalEntries}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-1">Most Common</p>
              <p className="text-2xl font-bold text-blue-600 capitalize">
                {statistics.mostCommonMood || 'N/A'}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg col-span-2">
              <p className="text-sm text-gray-700 mb-2">Mood Distribution (Last 30 days)</p>
              <div className="space-y-2">
                {Object.entries(statistics.moodCounts).map(([moodKey, count]) => (
                  <div key={moodKey} className="flex items-center gap-2">
                    <span className="text-xs font-medium capitalize w-12">{moodKey}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          moodKey === 'great' ? 'bg-green-500' :
                          moodKey === 'good' ? 'bg-blue-500' :
                          moodKey === 'okay' ? 'bg-yellow-500' :
                          moodKey === 'bad' ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{
                          width: `${((count as number) / (statistics.totalEntries || 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{String(count)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mood Trend Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Last 7 Days Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Line type="monotone" dataKey="mood" stroke="#ec4899" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Entries */}
      {moodHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Recent Entries
          </h3>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {moodHistory.slice(0, 10).map((entry, i) => (
              <div key={i} className={`p-3 rounded-lg border-2 ${getMoodColor(entry.mood)}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold capitalize">{entry.mood}</span>
                  <span className="text-xs text-gray-600">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                </div>
                {entry.notes && <p className="text-sm text-gray-700">{entry.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;
 
