import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema({
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Model',
    required: true
  },
  testSet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dataset'
  },
  metrics: {
    accuracy: Number,
    precision: Number,
    recall: Number,
    f1Score: Number,
    confusionMatrix: mongoose.Schema.Types.Mixed,
    intentMetrics: [{
      intent: String,
      precision: Number,
      recall: Number,
      f1Score: Number,
      support: Number
    }],
    entityMetrics: [{
      entity: String,
      precision: Number,
      recall: Number,
      f1Score: Number,
      support: Number
    }]
  },
  predictions: [{
    text: String,
    actualIntent: String,
    predictedIntent: String,
    confidence: Number,
    entities: mongoose.Schema.Types.Mixed
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

export default Evaluation;
