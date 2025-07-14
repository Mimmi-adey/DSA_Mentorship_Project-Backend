const adminMiddleware = (req, res, next) => {
  try {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error in admin middleware.' });
  }
};

export { adminMiddleware };