import AuthModel from '../models/authSchema.js';

const getAllUsers = async (req, res) => {
  try {
    const users = await AuthModel.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const updated = await AuthModel.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update role' });
  }
};

export { getAllUsers, updateUserRole };