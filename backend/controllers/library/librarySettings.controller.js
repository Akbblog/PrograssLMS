const LibrarySettings = require('../../models/Library/LibrarySettings.model');

exports.getSettings = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    let settings = await LibrarySettings.findOne({ schoolId });
    if (!settings) {
      // create default settings if not present
      settings = await LibrarySettings.create({ schoolId });
    }
    res.status(200).json({ status: 'success', data: settings });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const updates = req.body;
    const settings = await LibrarySettings.findOneAndUpdate({ schoolId }, updates, { new: true, upsert: true });
    res.status(200).json({ status: 'success', data: settings });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
