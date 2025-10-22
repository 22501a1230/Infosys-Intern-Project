import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Brain, Database } from 'lucide-react';

const ModelTraining = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [datasets, setDatasets] = useState<any[]>([]);
  const [modelName, setModelName] = useState('');
  const [selectedDataset, setSelectedDataset] = useState('');
  const [backend, setBackend] = useState('spaCy');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDatasets();
  }, [projectId]);

  const fetchDatasets = async () => {
    try {
      const response = await api.get(`/datasets/project/${projectId}`);
      setDatasets(response.data);
    } catch (error) {
      console.error('Error fetching datasets:', error);
    }
  };

  const handleTrain = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/models/train', {
        name: modelName,
        projectId,
        datasetId: selectedDataset,
        backend
      });

      alert('Model training started successfully!');
      navigate(`/model/${response.data._id}/evaluate`);
    } catch (error) {
      console.error('Error training model:', error);
      alert('Error training model');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-6">
            <Brain className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-slate-800">Train NLU Model</h1>
          </div>

          <form onSubmit={handleTrain} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Model Name
              </label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Travel Bot Model v1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Training Dataset
              </label>
              <select
                value={selectedDataset}
                onChange={(e) => setSelectedDataset(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a dataset</option>
                {datasets.map((dataset) => (
                  <option key={dataset._id} value={dataset._id}>
                    {dataset.name} ({dataset.totalSamples} samples)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                NLU Backend
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['Rasa', 'spaCy', 'Hugging Face'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setBackend(option)}
                    className={`p-4 border-2 rounded-lg transition ${
                      backend === option
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-semibold text-slate-800">{option}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {option === 'Rasa' && 'Open-source'}
                        {option === 'spaCy' && 'Industrial-strength'}
                        {option === 'Hugging Face' && 'Transformers'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedDataset && datasets.find(d => d._id === selectedDataset) && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h3 className="font-medium text-slate-800 mb-2">Dataset Overview</h3>
                {(() => {
                  const dataset = datasets.find(d => d._id === selectedDataset);
                  return (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Total Samples:</span>
                        <span className="font-medium">{dataset.totalSamples}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Intents:</span>
                        <span className="font-medium">{dataset.intents.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Entities:</span>
                        <span className="font-medium">{dataset.entities.length}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !selectedDataset}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Training...' : 'Start Training'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModelTraining;
