import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Play } from 'lucide-react';

const ModelEvaluation = () => {
  const { modelId } = useParams();
  const [model, setModel] = useState<any>(null);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState<any>(null);
  const [datasets, setDatasets] = useState<any[]>([]);
  const [selectedTestSet, setSelectedTestSet] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchModel();
    fetchEvaluations();
  }, [modelId]);

  const fetchModel = async () => {
    try {
      const response = await api.get(`/models/${modelId}`);
      setModel(response.data);

      const datasetsResponse = await api.get(`/datasets/project/${response.data.project}`);
      setDatasets(datasetsResponse.data);
    } catch (error) {
      console.error('Error fetching model:', error);
    }
  };

  const fetchEvaluations = async () => {
    try {
      const response = await api.get(`/evaluations/model/${modelId}`);
      setEvaluations(response.data);
      if (response.data.length > 0) {
        setSelectedEvaluation(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching evaluations:', error);
    }
  };

  const handleEvaluate = async () => {
    if (!selectedTestSet) return;

    setLoading(true);
    try {
      const response = await api.post('/evaluations/evaluate', {
        modelId,
        testSetId: selectedTestSet
      });

      setSelectedEvaluation(response.data);
      fetchEvaluations();
      alert('Evaluation completed!');
    } catch (error) {
      console.error('Error evaluating model:', error);
      alert('Error evaluating model');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!selectedEvaluation) return;

    try {
      const response = await api.get(`/evaluations/${selectedEvaluation._id}/export`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([JSON.stringify(response.data, null, 2)]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `evaluation-${selectedEvaluation._id}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting evaluation:', error);
    }
  };

  if (!model) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{model.name}</h1>
          <p className="text-slate-600">
            {model.backend} • {model.version}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Run Evaluation</h2>

              <div className="flex space-x-3">
                <select
                  value={selectedTestSet}
                  onChange={(e) => setSelectedTestSet(e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-md"
                >
                  <option value="">Select test dataset</option>
                  {datasets.map((dataset) => (
                    <option key={dataset._id} value={dataset._id}>
                      {dataset.name} ({dataset.totalSamples} samples)
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleEvaluate}
                  disabled={loading || !selectedTestSet}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  <Play className="w-4 h-4" />
                  <span>{loading ? 'Running...' : 'Evaluate'}</span>
                </button>
              </div>
            </div>

            {selectedEvaluation && (
              <>
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-slate-800">Metrics</h2>
                    <button
                      onClick={handleExport}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        {(selectedEvaluation.metrics.accuracy * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-slate-600 mt-1">Accuracy</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">
                        {(selectedEvaluation.metrics.precision * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-slate-600 mt-1">Precision</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">
                        {(selectedEvaluation.metrics.recall * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-slate-600 mt-1">Recall</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-3xl font-bold text-orange-600">
                        {(selectedEvaluation.metrics.f1Score * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-slate-600 mt-1">F1 Score</div>
                    </div>
                  </div>

                  {selectedEvaluation.metrics.intentMetrics && (
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-4">Intent-wise Performance</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={selectedEvaluation.metrics.intentMetrics}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="intent" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="precision" fill="#3b82f6" name="Precision" />
                          <Bar dataKey="recall" fill="#10b981" name="Recall" />
                          <Bar dataKey="f1Score" fill="#f59e0b" name="F1 Score" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-slate-800 mb-4">Predictions</h2>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedEvaluation.predictions.slice(0, 20).map((pred: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-3 border rounded-md ${
                          pred.actualIntent === pred.predictedIntent
                            ? 'border-green-200 bg-green-50'
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="text-sm font-medium text-slate-800 mb-1">{pred.text}</div>
                        <div className="flex items-center space-x-4 text-xs">
                          <span className="text-slate-600">
                            Actual: <span className="font-medium">{pred.actualIntent}</span>
                          </span>
                          <span className="text-slate-600">
                            Predicted: <span className="font-medium">{pred.predictedIntent}</span>
                          </span>
                          <span className="text-slate-600">
                            Confidence: <span className="font-medium">{(pred.confidence * 100).toFixed(0)}%</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Evaluation History</h2>

              {evaluations.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No evaluations yet</p>
              ) : (
                <div className="space-y-2">
                  {evaluations.map((evaluation) => (
                    <button
                      key={evaluation._id}
                      onClick={() => setSelectedEvaluation(evaluation)}
                      className={`w-full text-left p-3 border rounded-md transition ${
                        selectedEvaluation?._id === evaluation._id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-sm font-medium text-slate-800">
                        {new Date(evaluation.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        Accuracy: {(evaluation.metrics.accuracy * 100).toFixed(1)}%
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelEvaluation;
