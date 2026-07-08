export const profileController = {
  getProfile: async (req, res, next) => {
    try {
      res.status(200).json({
        message: 'Profile fetched successfully',
        user: req.user,
      });
    } catch (error) {
      next(error);
    }
  },
};
