import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { Save, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface Annotation {
  _id: string;
  text: string;
  intent: string;
  entities: Array<{
    entity: string;
    value: string;
    start: number;
    end: number;
  }>;
}

const Annotation = () => {
  const { datasetId } = useParams();
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [currentIntent, setCurrentIntent] = useState('');
  const [currentEntities, setCurrentEntities] = useState<any[]>([]);
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);
  const [entityType, setEntityType] = useState('location');
  const [availableIntents, setAvailableIntents] = useState<string[]>([
    'book_flight',
    'check_weather',
    'find_restaurant',
    'greet',
    'goodbye'
  ]);
  const [availableEntities, setAvailableEntities] = useState<string[]>([
    'location',
    'date',
    'person',
    'organization',
    'cuisine'
  ]);

  useEffect(() => {
    fetchAnnotations();
  }, [datasetId]);

  useEffect(() => {
    if (annotations.length > 0 && currentIndex < annotations.length) {
      const current = annotations[currentIndex];
      setCurrentText(current.text);
      setCurrentIntent(current.intent);
      setCurrentEntities(current.entities || []);
    }
  }, [currentIndex, annotations]);

  const fetchAnnotations = async () => {
    try {
      const response = await api.get(`/annotations/dataset/${datasetId}`);
      setAnnotations(response.data);
    } catch (error) {
      console.error('Error fetching annotations:', error);
    }
  };

  const handleTextSelection = () => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText) {
      const start = currentText.indexOf(selectedText);
      if (start !== -1) {
        setSelection({ start, end: start + selectedText.length });
      }
    }
  };

  const handleAddEntity = () => {
    if (selection) {
      const newEntity = {
        entity: entityType,
        value: currentText.substring(selection.start, selection.end),
        start: selection.start,
        end: selection.end
      };

      setCurrentEntities([...currentEntities, newEntity]);
      setSelection(null);
    }
  };

  const handleRemoveEntity = (index: number) => {
    setCurrentEntities(currentEntities.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (annotations[currentIndex]) {
      try {
        await api.put(`/annotations/${annotations[currentIndex]._id}`, {
          text: currentText,
          intent: currentIntent,
          entities: currentEntities
        });
        alert('Annotation saved!');
      } catch (error) {
        console.error('Error saving annotation:', error);
      }
    }
  };

  const handleAutoSuggest = async () => {
    try {
      const response = await api.post('/annotations/suggest', {
        text: currentText
      });

      if (response.data.intents && response.data.intents.length > 0) {
        setCurrentIntent(response.data.intents[0]);
      }

      if (response.data.entities && response.data.entities.length > 0) {
        setCurrentEntities([...currentEntities, ...response.data.entities]);
      }
    } catch (error) {
      console.error('Error getting suggestions:', error);
    }
  };

  const handleNext = () => {
    if (currentIndex < annotations.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const renderHighlightedText = () => {
    if (currentEntities.length === 0) {
      return <span>{currentText}</span>;
    }

    const sortedEntities = [...currentEntities].sort((a, b) => a.start - b.start);
    const parts = [];
    let lastIndex = 0;

    sortedEntities.forEach((entity, idx) => {
      if (entity.start > lastIndex) {
        parts.push(
          <span key={`text-${idx}`}>{currentText.substring(lastIndex, entity.start)}</span>
        );
      }

      parts.push(
        <span
          key={`entity-${idx}`}
          className="bg-yellow-200 px-1 rounded cursor-pointer hover:bg-yellow-300"
          onClick={() => handleRemoveEntity(idx)}
          title={`${entity.entity}: ${entity.value} (click to remove)`}
        >
          {entity.value}
          <span className="text-xs ml-1 text-yellow-700">({entity.entity})</span>
        </span>
      );

      lastIndex = entity.end;
    });

    if (lastIndex < currentText.length) {
      parts.push(
        <span key="text-end">{currentText.substring(lastIndex)}</span>
      );
    }

    return <>{parts}</>;
  };

  if (annotations.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-xl text-slate-600">No annotations found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Annotation Tool</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-slate-600">
              Sample {currentIndex + 1} of {annotations.length}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="p-2 border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === annotations.length - 1}
                className="p-2 border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Text (Select text to tag entities)
            </label>
            <div
              className="p-4 bg-slate-50 border border-slate-200 rounded-md min-h-20 cursor-text text-lg leading-relaxed"
              onMouseUp={handleTextSelection}
            >
              {renderHighlightedText()}
            </div>
          </div>

          {selection && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-slate-700 mb-2">
                Selected: "{currentText.substring(selection.start, selection.end)}"
              </p>
              <div className="flex items-center space-x-2">
                <select
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-md"
                >
                  {availableEntities.map((entity) => (
                    <option key={entity} value={entity}>
                      {entity}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddEntity}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Tag Entity
                </button>
                <button
                  onClick={() => setSelection(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Intent</label>
            <div className="flex flex-wrap gap-2">
              {availableIntents.map((intent) => (
                <button
                  key={intent}
                  onClick={() => setCurrentIntent(intent)}
                  className={`px-4 py-2 rounded-md transition ${
                    currentIntent === intent
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {intent}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tagged Entities ({currentEntities.length})
            </label>
            {currentEntities.length === 0 ? (
              <p className="text-sm text-slate-500">No entities tagged</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {currentEntities.map((entity, idx) => (
                  <span
                    key={idx}
                    onClick={() => handleRemoveEntity(idx)}
                    className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm cursor-pointer hover:bg-yellow-200"
                    title="Click to remove"
                  >
                    {entity.value} ({entity.entity})
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleAutoSuggest}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              <Sparkles className="w-4 h-4" />
              <span>Auto-Suggest</span>
            </button>

            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Annotation;
