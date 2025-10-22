import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Dataset from '../models/Dataset.js';
import Annotation from '../models/Annotation.js';

dotenv.config();

const sampleData = {
  examples: [
    {
      text: "I want to book a flight to New York",
      intent: "book_flight",
      entities: [
        { entity: "location", value: "New York", start: 26, end: 34 }
      ]
    },
    {
      text: "What's the weather like in Paris tomorrow?",
      intent: "check_weather",
      entities: [
        { entity: "location", value: "Paris", start: 27, end: 32 },
        { entity: "date", value: "tomorrow", start: 33, end: 41 }
      ]
    },
    {
      text: "Find me a good Italian restaurant nearby",
      intent: "find_restaurant",
      entities: [
        { entity: "cuisine", value: "Italian", start: 15, end: 22 }
      ]
    },
    {
      text: "Hello, how are you?",
      intent: "greet",
      entities: []
    },
    {
      text: "Thanks, goodbye!",
      intent: "goodbye",
      entities: []
    },
    {
      text: "Book a flight from London to Tokyo on Friday",
      intent: "book_flight",
      entities: [
        { entity: "location", value: "London", start: 19, end: 25 },
        { entity: "location", value: "Tokyo", start: 29, end: 34 },
        { entity: "date", value: "Friday", start: 38, end: 44 }
      ]
    },
    {
      text: "Is it going to rain today?",
      intent: "check_weather",
      entities: [
        { entity: "date", value: "today", start: 20, end: 25 }
      ]
    },
    {
      text: "I need a reservation at a French restaurant for tonight",
      intent: "find_restaurant",
      entities: [
        { entity: "cuisine", value: "French", start: 26, end: 32 },
        { entity: "date", value: "tonight", start: 48, end: 55 }
      ]
    },
    {
      text: "Hi there!",
      intent: "greet",
      entities: []
    },
    {
      text: "See you later",
      intent: "goodbye",
      entities: []
    }
  ]
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    await User.deleteMany({});
    await Project.deleteMany({});
    await Dataset.deleteMany({});
    await Annotation.deleteMany({});

    const adminUser = await User.create({
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    const demoUser = await User.create({
      email: 'demo@example.com',
      password: 'demo123',
      role: 'user'
    });

    const project1 = await Project.create({
      name: 'Travel Bot',
      description: 'A chatbot for travel-related queries',
      user: demoUser._id
    });

    const project2 = await Project.create({
      name: 'HR Bot',
      description: 'A chatbot for HR assistance',
      user: demoUser._id
    });

    const intents = {};
    const entities = {};
    sampleData.examples.forEach(item => {
      intents[item.intent] = (intents[item.intent] || 0) + 1;
      item.entities.forEach(ent => {
        entities[ent.entity] = (entities[ent.entity] || 0) + 1;
      });
    });

    const dataset = await Dataset.create({
      name: 'Travel Dataset',
      project: project1._id,
      format: 'JSON',
      data: sampleData,
      intents: Object.keys(intents).map(name => ({ name, count: intents[name] })),
      entities: Object.keys(entities).map(name => ({ name, count: entities[name] })),
      totalSamples: sampleData.examples.length
    });

    const annotations = sampleData.examples.map(item => ({
      dataset: dataset._id,
      text: item.text,
      intent: item.intent,
      entities: item.entities,
      confidence: 0.95
    }));

    await Annotation.insertMany(annotations);

    console.log('Database seeded successfully!');
    console.log('\nDemo Credentials:');
    console.log('Admin - Email: admin@example.com, Password: admin123');
    console.log('User - Email: demo@example.com, Password: demo123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
