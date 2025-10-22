import Model from '../models/Model.js';
import Annotation from '../models/Annotation.js';
import Project from '../models/Project.js';

export const trainModel = async (req, res) => {
  try {
    const { name, projectId, datasetId, backend } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const annotations = await Annotation.find({ dataset: datasetId });

    const version = `v${Date.now()}`;
    const path = `/models/${projectId}/${version}`;

    const model = await Model.create({
      name,
      project: projectId,
      backend: backend || 'spaCy',
      version,
      path,
      trainedOn: datasetId,
      metadata: {
        trainingExamples: annotations.length,
        trainedAt: new Date(),
        intents: [...new Set(annotations.map(a => a.intent))],
        entities: [...new Set(annotations.flatMap(a => a.entities.map(e => e.entity)))]
      },
      status: 'completed'
    });

    res.status(201).json(model);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getModels = async (req, res) => {
  try {
    const { projectId } = req.params;

    const models = await Model.find({ project: projectId })
      .populate('trainedOn')
      .sort({ createdAt: -1 });

    res.json(models);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getModel = async (req, res) => {
  try {
    const model = await Model.findById(req.params.id).populate('trainedOn');

    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }

    res.json(model);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteModel = async (req, res) => {
  try {
    const model = await Model.findById(req.params.id);

    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }

    await model.deleteOne();
    res.json({ message: 'Model deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
