import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { Upload, Database, Brain, FileText, Plus } from 'lucide-react';

interface ProjectData {
  project: any;
  datasets: any[];
  models: any[];
}

const ProjectDetail = () => {
  const { id } = useParams();
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [datasetName, setDatasetName] = useState('');
  const [format, setFormat] = useState('JSON');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProjectData(response.data);
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileContent = event.target?.result as string;
        let data;

        try {
          data = JSON.parse(fileContent);
        } catch {
          data = fileContent;
        }

        await api.post('/datasets/upload', {
          name: datasetName,
          projectId: id,
          format,
          data
        });

        setShowUploadModal(false);
        setUploadFile(null);
        setDatasetName('');
        fetchProjectData();
      };

      reader.readAsText(uploadFile);
    } catch (error) {
      console.error('Error uploading dataset:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!projectData) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {projectData.project.name}
          </h1>
          <p className="text-slate-600">{projectData.project.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Datasets
              </h2>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Upload</span>
              </button>
            </div>

            {projectData.datasets.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No datasets uploaded</p>
            ) : (
              <div className="space-y-2">
                {projectData.datasets.map((dataset) => (
                  <Link
                    key={dataset._id}
                    to={`/dataset/${dataset._id}/annotate`}
                    className="block p-4 border border-slate-200 rounded-md hover:bg-slate-50 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-slate-800">{dataset.name}</h3>
                        <p className="text-sm text-slate-500">
                          {dataset.totalSamples} samples • {dataset.format}
                        </p>
                      </div>
                      <FileText className="w-5 h-5 text-slate-400" />
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {dataset.intents.slice(0, 3).map((intent: any) => (
                        <span
                          key={intent.name}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                        >
                          {intent.name}
                        </span>
                      ))}
                      {dataset.intents.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                          +{dataset.intents.length - 3} more
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                Models
              </h2>
              {projectData.datasets.length > 0 && (
                <Link
                  to={`/project/${id}/train`}
                  className="flex items-center space-x-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Train</span>
                </Link>
              )}
            </div>

            {projectData.models.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No models trained</p>
            ) : (
              <div className="space-y-2">
                {projectData.models.map((model) => (
                  <Link
                    key={model._id}
                    to={`/model/${model._id}/evaluate`}
                    className="block p-4 border border-slate-200 rounded-md hover:bg-slate-50 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-slate-800">{model.name}</h3>
                        <p className="text-sm text-slate-500">
                          {model.backend} • {model.version}
                        </p>
                      </div>
                      <Brain className="w-5 h-5 text-green-600" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Upload Dataset</h2>

              <form onSubmit={handleFileUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Dataset Name
                  </label>
                  <input
                    type="text"
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Training Data"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Format
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="JSON">JSON</option>
                    <option value="CSV">CSV</option>
                    <option value="Rasa">Rasa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    File
                  </label>
                  <input
                    type="file"
                    accept=".json,.csv"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md"
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {loading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
