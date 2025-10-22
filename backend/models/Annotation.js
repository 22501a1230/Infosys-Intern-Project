import mongoose from 'mongoose';

const annotationSchema = new mongoose.Schema({
  dataset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dataset',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  intent: {
    type: String,
    required: true
  },
  entities: [{
    entity: String,
    value: String,
    start: Number,
    end: Number
  }],
  confidence: {
    type: Number,
    default: 1.0
  },
  isUncertain: {
    type: Boolean,
    default: false
  },
  needsReview: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Annotation = mongoose.model('Annotation', annotationSchema);

export default Annotation;
