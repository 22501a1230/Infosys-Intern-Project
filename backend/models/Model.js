import mongoose from 'mongoose';

const modelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  backend: {
    type: String,
    enum: ['Rasa', 'spaCy', 'Hugging Face'],
    required: true
  },
  version: {
    type: String,
    required: true
  },
  path: {
    type: String,
    default: ''
  },
  trainedOn: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dataset'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  status: {
    type: String,
    enum: ['training', 'completed', 'failed'],
    default: 'completed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Model = mongoose.model('Model', modelSchema);

export default Model;
