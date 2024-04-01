import User from "../Models/user.model.js";

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    const { password, ...userData } = updatedUser._doc;

    res.status(200).send({
      success: true,
      message: "Username has been updated successfully.",
      user: userData,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).send({
      success: true,
      message: "User has been deleted successfully.",
    });
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    const { password, ...userData } = user._doc;

    res.status(200).send({
      success: true,
      message: "User has been displayed successfully.",
      user: userData,
    });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    // Exclude password field from all user data
    const allUsers = users.map((user) => {
      const { password, ...userData } = user._doc;
      return userData;
    });

    res.status(200).send({
      success: true,
      message: "All the users have been displayed successfully.",
      users: allUsers,
    });
  } catch (err) {
    next(err);
  }
};