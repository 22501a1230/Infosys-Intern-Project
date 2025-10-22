import Dataset from '../models/Dataset.js';
import Annotation from '../models/Annotation.js';
import Project from '../models/Project.js';
import csv from 'csv-parser';
import { Readable } from 'stream';

const parseDataset = (data, format) => {
  let intents = {};
  let entities = {};
  let totalSamples = 0;

  if (format === 'JSON') {
    const jsonData = typeof data === 'string' ? JSON.parse(data) : data;
    const examples = jsonData.examples || jsonData.data || jsonData;

    examples.forEach(item => {
      totalSamples++;
      const intent = item.intent || item.label;
      intents[intent] = (intents[intent] || 0) + 1;

      if (item.entities) {
        item.entities.forEach(ent => {
          const entityName = ent.entity || ent.type;
          entities[entityName] = (entities[entityName] || 0) + 1;
        });
      }
    });
  } else if (format === 'Rasa') {
    const rasaData = typeof data === 'string' ? JSON.parse(data) : data;
    const nlu = rasaData.nlu || rasaData.rasa_nlu_data?.common_examples || [];

    nlu.forEach(item => {
      totalSamples++;
      intents[item.intent] = (intents[item.intent] || 0) + 1;

      if (item.entities) {
        item.entities.forEach(ent => {
          entities[ent.entity] = (entities[ent.entity] || 0) + 1;
        });
      }
    });
  }

  return {
    intents: Object.keys(intents).map(name => ({ name, count: intents[name] })),
    entities: Object.keys(entities).map(name => ({ name, count: entities[name] })),
    totalSamples
  };
};

export const uploadDataset = async (req, res) => {
  try {
    const { name, projectId, format } = req.body;
    const data = req.body.data;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { intents, entities, totalSamples } = parseDataset(data, format);

    const dataset = await Dataset.create({
      name,
      project: projectId,
      format,
      data,
      intents,
      entities,
      totalSamples
    });

    const parsedData = format === 'JSON' || format === 'Rasa'
      ? (typeof data === 'string' ? JSON.parse(data) : data)
      : data;

    const examples = parsedData.examples || parsedData.data || parsedData.nlu || parsedData;

    if (Array.isArray(examples)) {
      const annotations = examples.map(item => ({
        dataset: dataset._id,
        text: item.text || item.sentence,
        intent: item.intent || item.label,
        entities: item.entities || []
      }));

      await Annotation.insertMany(annotations);
    }

    res.status(201).json(dataset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDatasets = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const datasets = await Dataset.find({ project: projectId });
    res.json(datasets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDataset = async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);

    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }

    res.json(dataset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDataset = async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);

    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }

    await Annotation.deleteMany({ dataset: dataset._id });
    await dataset.deleteOne();

    res.json({ message: 'Dataset deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
