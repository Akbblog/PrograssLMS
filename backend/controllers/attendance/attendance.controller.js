const Attendance = require('../../models/Academic/Attendance.model');
const StudentQRCode = require('../../models/Students/StudentQRCode.model');
const AttendanceDevice = require('../../models/Academic/AttendanceDevice.model');
const qrService = require('../../services/qrcode/qrGenerator.service');
const attendanceSocket = require('../../services/realtime/attendanceSocket.service');

exports.scanQRCode = async (req, res) => {
  try {
    const { qrData, deviceId, latitude, longitude, accuracy } = req.body;
    const decoded = qrService.decryptPayload(qrData);
    if (!decoded || !decoded.studentId) return res.status(400).json({ status: 'fail', message: 'Invalid QR data' });

    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;

    // Check student qrcode is active
    const qrRecord = await StudentQRCode.findOne({ student: decoded.studentId, qrCodeData: qrData, schoolId });

    if (!qrRecord || !qrRecord.isActive) return res.status(400).json({ status: 'fail', message: 'QR not active' });

    // Create attendance record
    const attendance = await Attendance.create({
      schoolId,
      student: decoded.studentId,
      classLevel: decoded.classLevel || null,
      date: new Date(),
      status: 'present',
      scanMethod: 'qr-scan',
      deviceId: deviceId || null,
      deviceName: deviceId || null,
      geoLocation: latitude ? { latitude, longitude, accuracy } : undefined,
      verifiedBy: 'automated',
      qrScanTimestamp: new Date()
    });

    // update qr record lastScannedAt
    qrRecord.lastScannedAt = new Date();
    await qrRecord.save();

    // Emit socket event
    const io = attendanceSocket.getIO();
    if (io) io.emit('attendance:marked', { attendanceId: attendance._id, student: attendance.student, timestamp: attendance.qrScanTimestamp });

    res.status(201).json({ status: 'success', data: attendance });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.generateQRCode = async (req, res) => {
  try {
    const { studentId } = req.params;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;

    const payload = { studentId, schoolId, generatedAt: new Date() };
    const { data, dataUrl } = await qrService.generateQRCodeImage(payload);

    const rec = await StudentQRCode.findOneAndUpdate({ student: studentId, schoolId, version: 1 }, { qrCodeData: data, qrCodeImage: dataUrl, isActive: true, validFrom: new Date() }, { upsert: true, new: true });

    res.status(201).json({ status: 'success', data: rec });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.generateBulk = async (req, res) => {
  try {
    const { studentIds } = req.body; // array
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const results = [];

    for (const sid of studentIds) {
      const payload = { studentId: sid, schoolId, generatedAt: new Date() };
      const { data, dataUrl } = await qrService.generateQRCodeImage(payload);
      const rec = await StudentQRCode.findOneAndUpdate({ student: sid, schoolId, version: 1 }, { qrCodeData: data, qrCodeImage: dataUrl, isActive: true, validFrom: new Date() }, { upsert: true, new: true });
      results.push(rec);
    }

    res.status(201).json({ status: 'success', data: results });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.downloadQRCode = async (req, res) => {
  try {
    const { id } = req.params; // StudentQRCode id
    const rec = await StudentQRCode.findById(id);
    if (!rec) return res.status(404).json({ status: 'fail', message: 'QR not found' });
    res.status(200).json({ status: 'success', data: { dataUrl: rec.qrCodeImage } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.listDevices = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const devices = await AttendanceDevice.find({ schoolId });
    res.status(200).json({ status: 'success', data: devices });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.registerDevice = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const payload = { ...req.body, schoolId };
    const device = await AttendanceDevice.create(payload);
    res.status(201).json({ status: 'success', data: device });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.liveStats = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const today = new Date();
    today.setHours(0,0,0,0);

    const totalToday = await Attendance.countDocuments({ schoolId, date: { $gte: today } });
    const recent = await Attendance.find({ schoolId }).sort({ createdAt: -1 }).limit(50).populate('student');

    res.status(200).json({ status: 'success', data: { totalToday, recent } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.recentScans = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const recent = await Attendance.find({ schoolId }).sort({ createdAt: -1 }).limit(50).populate('student');
    res.status(200).json({ status: 'success', data: recent });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};