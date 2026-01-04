const Payroll = require('../../models/HR/Payroll.model');

exports.listPayrolls = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const list = await Payroll.find({ schoolId }).populate('staff');
    res.status(200).json({ status: 'success', data: list });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};

exports.generatePayroll = async (req, res) => {
  try {
    // payload: staff, month, year, earnings, deductions
    const { staff, month, year, earnings, deductions } = req.body;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;

    const totalEarnings = (earnings.basic||0) + (earnings.hra||0) + (earnings.bonus||0);
    const totalDeductions = (deductions.pf||0) + (deductions.tax||0);
    const gross = totalEarnings;
    const net = gross - totalDeductions;

    const payroll = await Payroll.create({ schoolId, staff, month, year, earnings: { ...earnings, totalEarnings }, deductions: { ...deductions, totalDeductions }, grossSalary: gross, netSalary: net });
    res.status(201).json({ status: 'success', data: payroll });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};

exports.processPayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const payroll = await Payroll.findById(id);
    if (!payroll) return res.status(404).json({ status: 'fail', message: 'Not found' });
    payroll.status = 'processed';
    payroll.paymentDate = new Date();
    await payroll.save();
    res.status(200).json({ status: 'success', data: payroll });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};