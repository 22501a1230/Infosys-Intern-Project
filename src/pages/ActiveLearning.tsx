import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

interface UncertainSample {
  _id: string;
  text: string;
  intent: string;
  confidence: number;
  entities: any[];
}

const ActiveLearning = () => {
  const { datasetId } = useParams();
  const [uncertainSamples, setUncertainSamples] = useState<UncertainSample[]>([]);
  const [threshold, setThreshold] = useState(0.7);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newIntent, setNewIntent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUncertainSamples();
  }, [datasetId, threshold]);

  const fetchUncertainSamples = async () => {
    try {
      const response = await api.get(`/annotations/uncertain/${datasetId}?threshold=${threshold}`);
      setUncertainSamples(response.data);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error fetching uncertain samples:', error);
    }
  };

  const handleCorrect = async (action: 'correct' | 'incorrect') => {
    if (currentIndex >= uncertainSamples.length) return;

    const sample = uncertainSamples[currentIndex];
    setLoading(true);

    try {
      if (action === 'correct') {
        await api.put(`/annotations/${sample._id}`, {
          ...sample,
          confidence: 1.0,
          needsReview: false
        });
      } else {
        await api.put(`/annotations/${sample._id}`, {
          ...sample,
          intent: newIntent || sample.intent,
          confidence: 1.0,
          needsReview: false
        });
      }

      if (currentIndex < uncertainSamples.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        fetchUncertainSamples();
      }

      setNewIntent('');
    } catch (error) {
      console.error('Error updating annotation:', error);
    } finally {
      setLoading(false);
    }
  };

  if (uncertainSamples.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">All Samples Reviewed!</h2>
          <p className="text-slate-600 mb-4">
            No uncertain samples found with confidence below {(threshold * 100).toFixed(0)}%
          </p>
          <button
            onClick={() => setThreshold(threshold + 0.1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Increase Threshold
          </button>
        </div>
      </div>
    );
  }

  const currentSample = uncertainSamples[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Active Learning</h1>
          <p className="text-slate-600">Review and correct uncertain predictions</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">
                Sample {currentIndex + 1} of {uncertainSamples.length}
              </span>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-slate-600">Confidence threshold:</label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  className="w-20 px-2 py-1 border border-slate-300 rounded"
                />
              </div>
            </div>

            <button
              onClick={fetchUncertainSamples}
              className="flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>

          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-1" />
              <div className="flex-1">
                <div className="font-medium text-slate-800 mb-2">Low Confidence Prediction</div>
                <div className="text-sm text-slate-600 mb-2">
                  Confidence: {(currentSample.confidence * 100).toFixed(1)}%
                </div>
                <div className="p-3 bg-white rounded border border-yellow-200">
                  <p className="text-lg text-slate-800">{currentSample.text}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Current Intent
            </label>
            <div className="px-4 py-3 bg-slate-100 rounded-md font-medium text-slate-800">
              {currentSample.intent}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Correct Intent (if different)
            </label>
            <input
              type="text"
              value={newIntent}
              onChange={(e) => setNewIntent(e.target.value)}
              placeholder="Enter correct intent or leave empty if current is correct"
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {currentSample.entities.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Entities
              </label>
              <div className="flex flex-wrap gap-2">
                {currentSample.entities.map((entity: any, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                  >
                    {entity.value} ({entity.entity})
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={() => handleCorrect('correct')}
              disabled={loading}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Mark as Correct</span>
            </button>

            <button
              onClick={() => handleCorrect('incorrect')}
              disabled={loading || !newIntent}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Correct & Save</span>
            </button>
          </div>

          <p className="text-xs text-slate-500 text-center mt-4">
            These corrections will be added to your training data for model improvement
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-slate-800 mb-3">Remaining Uncertain Samples</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {uncertainSamples.map((sample, idx) => (
              <div
                key={sample._id}
                className={`p-3 border rounded-md cursor-pointer transition ${
                  idx === currentIndex
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
                onClick={() => setCurrentIndex(idx)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-slate-800 line-clamp-1">{sample.text}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Intent: {sample.intent} • Confidence: {(sample.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                  {idx < currentIndex && (
                    <CheckCircle className="w-4 h-4 text-green-600 ml-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveLearning;
