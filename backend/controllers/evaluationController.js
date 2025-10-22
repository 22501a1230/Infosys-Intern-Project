import Evaluation from '../models/Evaluation.js';
import Model from '../models/Model.js';
import Annotation from '../models/Annotation.js';

const calculateMetrics = (predictions) => {
  let correct = 0;
  const intentCounts = {};
  const confusionMatrix = {};

  predictions.forEach(pred => {
    if (pred.actualIntent === pred.predictedIntent) {
      correct++;
    }

    if (!confusionMatrix[pred.actualIntent]) {
      confusionMatrix[pred.actualIntent] = {};
    }
    confusionMatrix[pred.actualIntent][pred.predictedIntent] =
      (confusionMatrix[pred.actualIntent][pred.predictedIntent] || 0) + 1;

    intentCounts[pred.actualIntent] = (intentCounts[pred.actualIntent] || 0) + 1;
  });

  const accuracy = correct / predictions.length;

  const intentMetrics = Object.keys(intentCounts).map(intent => {
    const truePositive = confusionMatrix[intent]?.[intent] || 0;
    const falsePositive = Object.keys(confusionMatrix).reduce((sum, actual) => {
      return sum + (actual !== intent ? (confusionMatrix[actual]?.[intent] || 0) : 0);
    }, 0);
    const falseNegative = Object.keys(confusionMatrix[intent] || {}).reduce((sum, predicted) => {
      return sum + (predicted !== intent ? confusionMatrix[intent][predicted] : 0);
    }, 0);

    const precision = truePositive / (truePositive + falsePositive) || 0;
    const recall = truePositive / (truePositive + falseNegative) || 0;
    const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

    return {
      intent,
      precision,
      recall,
      f1Score,
      support: intentCounts[intent]
    };
  });

  const avgPrecision = intentMetrics.reduce((sum, m) => sum + m.precision, 0) / intentMetrics.length;
  const avgRecall = intentMetrics.reduce((sum, m) => sum + m.recall, 0) / intentMetrics.length;
  const avgF1 = intentMetrics.reduce((sum, m) => sum + m.f1Score, 0) / intentMetrics.length;

  return {
    accuracy,
    precision: avgPrecision,
    recall: avgRecall,
    f1Score: avgF1,
    confusionMatrix,
    intentMetrics,
    entityMetrics: []
  };
};

export const evaluateModel = async (req, res) => {
  try {
    const { modelId, testSetId } = req.body;

    const model = await Model.findById(modelId);
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }

    const testAnnotations = await Annotation.find({ dataset: testSetId });

    const predictions = testAnnotations.map(annotation => {
      const intents = ['book_flight', 'check_weather', 'find_restaurant', 'greet', 'goodbye'];
      const predictedIntent = intents[Math.floor(Math.random() * intents.length)];
      const confidence = 0.6 + Math.random() * 0.4;

      return {
        text: annotation.text,
        actualIntent: annotation.intent,
        predictedIntent,
        confidence,
        entities: annotation.entities
      };
    });

    const metrics = calculateMetrics(predictions);

    const evaluation = await Evaluation.create({
      model: modelId,
      testSet: testSetId,
      metrics,
      predictions
    });

    res.status(201).json(evaluation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEvaluations = async (req, res) => {
  try {
    const { modelId } = req.params;

    const evaluations = await Evaluation.find({ model: modelId })
      .populate('testSet')
      .sort({ timestamp: -1 });

    res.json(evaluations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id)
      .populate('model')
      .populate('testSet');

    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const compareModels = async (req, res) => {
  try {
    const { modelIds } = req.body;

    const evaluations = await Evaluation.find({
      model: { $in: modelIds }
    }).populate('model');

    const comparison = modelIds.map(modelId => {
      const modelEvals = evaluations.filter(e => e.model._id.toString() === modelId);
      const latestEval = modelEvals[0];

      return {
        modelId,
        modelName: latestEval?.model.name,
        version: latestEval?.model.version,
        metrics: latestEval?.metrics || {}
      };
    });

    res.json(comparison);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exportEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id)
      .populate('model')
      .populate('testSet');

    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    const exportData = {
      model: evaluation.model.name,
      version: evaluation.model.version,
      timestamp: evaluation.timestamp,
      metrics: evaluation.metrics,
      predictions: evaluation.predictions
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=evaluation-${evaluation._id}.json`);
    res.json(exportData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
