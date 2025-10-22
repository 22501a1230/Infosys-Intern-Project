import mongoose from 'mongoose';

const datasetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  format: {
    type: String,
    enum: ['JSON', 'CSV', 'Rasa'],
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  intents: [{
    name: String,
    count: Number
  }],
  entities: [{
    name: String,
    count: Number
  }],
  totalSamples: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Dataset = mongoose.model('Dataset', datasetSchema);

export default Dataset;
