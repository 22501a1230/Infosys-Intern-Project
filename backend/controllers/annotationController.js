import Annotation from '../models/Annotation.js';
import Dataset from '../models/Dataset.js';

export const getAnnotations = async (req, res) => {
  try {
    const { datasetId } = req.params;
    const annotations = await Annotation.find({ dataset: datasetId });
    res.json(annotations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAnnotation = async (req, res) => {
  try {
    const { datasetId, text, intent, entities } = req.body;

    const dataset = await Dataset.findById(datasetId);
    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }

    const annotation = await Annotation.create({
      dataset: datasetId,
      text,
      intent,
      entities: entities || []
    });

    res.status(201).json(annotation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAnnotation = async (req, res) => {
  try {
    const annotation = await Annotation.findById(req.params.id);

    if (!annotation) {
      return res.status(404).json({ message: 'Annotation not found' });
    }

    annotation.text = req.body.text || annotation.text;
    annotation.intent = req.body.intent || annotation.intent;
    annotation.entities = req.body.entities || annotation.entities;
    annotation.updatedAt = Date.now();

    const updatedAnnotation = await annotation.save();
    res.json(updatedAnnotation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAnnotation = async (req, res) => {
  try {
    const annotation = await Annotation.findById(req.params.id);

    if (!annotation) {
      return res.status(404).json({ message: 'Annotation not found' });
    }

    await annotation.deleteOne();
    res.json({ message: 'Annotation deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUncertainAnnotations = async (req, res) => {
  try {
    const { datasetId } = req.params;
    const threshold = parseFloat(req.query.threshold) || 0.7;

    const uncertainAnnotations = await Annotation.find({
      dataset: datasetId,
      $or: [
        { confidence: { $lt: threshold } },
        { isUncertain: true },
        { needsReview: true }
      ]
    }).sort({ confidence: 1 });

    res.json(uncertainAnnotations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const autoSuggest = async (req, res) => {
  try {
    const { text } = req.body;

    const suggestions = {
      intents: ['book_flight', 'check_weather', 'find_restaurant', 'greet', 'goodbye'],
      entities: []
    };

    const words = text.toLowerCase().split(' ');
    const possibleEntities = [];

    if (words.some(w => ['new york', 'paris', 'london', 'tokyo'].includes(w))) {
      possibleEntities.push({ entity: 'location', value: 'detected city', start: 0, end: text.length });
    }
    if (words.some(w => ['today', 'tomorrow', 'monday', 'friday'].includes(w))) {
      possibleEntities.push({ entity: 'date', value: 'detected date', start: 0, end: text.length });
    }

    suggestions.entities = possibleEntities;

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
