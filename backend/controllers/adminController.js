import User from '../models/User.js';
import Project from '../models/Project.js';
import Dataset from '../models/Dataset.js';
import Model from '../models/Model.js';
import Annotation from '../models/Annotation.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated', user: { _id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await Project.deleteMany({ user: user._id });
    await user.deleteOne();

    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalDatasets = await Dataset.countDocuments();
    const totalModels = await Model.countDocuments();
    const totalAnnotations = await Annotation.countDocuments();

    const recentProjects = await Project.find()
      .populate('user', 'email')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalProjects,
        totalDatasets,
        totalModels,
        totalAnnotations
      },
      recentProjects,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('user', 'email')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllDatasets = async (req, res) => {
  try {
    const datasets = await Dataset.find()
      .populate('project', 'name')
      .sort({ createdAt: -1 });

    res.json(datasets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
