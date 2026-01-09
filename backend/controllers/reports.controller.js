const responseStatus = require('../handlers/responseStatus.handler');
const reportsService = require('../services/reportsAggregation.service');

function getSchoolId(req) {
  return req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
}

exports.getDashboardOverviewController = async (req, res) => {
  try {
    const schoolId = getSchoolId(req);
    if (!schoolId) return responseStatus(res, 400, 'failed', 'Missing schoolId');

    const data = await reportsService.getDashboardOverview(schoolId, {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    });

    return responseStatus(res, 200, 'success', data);
  } catch (err) {
    return responseStatus(res, 500, 'failed', err.message || 'Failed to load dashboard report');
  }
};

exports.getAttendanceReportController = async (req, res) => {
  try {
    const schoolId = getSchoolId(req);
    if (!schoolId) return responseStatus(res, 400, 'failed', 'Missing schoolId');

    const data = await reportsService.getAttendanceReport(
      schoolId,
      { startDate: req.query.startDate, endDate: req.query.endDate },
      { classLevel: req.query.classLevel }
    );

    return responseStatus(res, 200, 'success', data);
  } catch (err) {
    return responseStatus(res, 500, 'failed', err.message || 'Failed to load attendance report');
  }
};

exports.getAcademicReportController = async (req, res) => {
  try {
    const schoolId = getSchoolId(req);
    if (!schoolId) return responseStatus(res, 400, 'failed', 'Missing schoolId');

    const data = await reportsService.getAcademicReport(schoolId, req.query.academicYearId, req.query.academicTermId);
    return responseStatus(res, 200, 'success', data);
  } catch (err) {
    return responseStatus(res, 500, 'failed', err.message || 'Failed to load academic report');
  }
};

exports.getFinanceReportController = async (req, res) => {
  try {
    const schoolId = getSchoolId(req);
    if (!schoolId) return responseStatus(res, 400, 'failed', 'Missing schoolId');

    const data = await reportsService.getFinanceReport(schoolId, { startDate: req.query.startDate, endDate: req.query.endDate });
    return responseStatus(res, 200, 'success', data);
  } catch (err) {
    return responseStatus(res, 500, 'failed', err.message || 'Failed to load finance report');
  }
};

exports.getHRReportController = async (req, res) => {
  try {
    const schoolId = getSchoolId(req);
    if (!schoolId) return responseStatus(res, 400, 'failed', 'Missing schoolId');

    const data = await reportsService.getHRReport(schoolId, req.query.month, req.query.year);
    return responseStatus(res, 200, 'success', data);
  } catch (err) {
    return responseStatus(res, 500, 'failed', err.message || 'Failed to load HR report');
  }
};

exports.getTransportReportController = async (req, res) => {
  try {
    const schoolId = getSchoolId(req);
    if (!schoolId) return responseStatus(res, 400, 'failed', 'Missing schoolId');

    const data = await reportsService.getTransportReport(schoolId);
    return responseStatus(res, 200, 'success', data);
  } catch (err) {
    return responseStatus(res, 500, 'failed', err.message || 'Failed to load transport report');
  }
};

exports.getLibraryReportController = async (req, res) => {
  try {
    const schoolId = getSchoolId(req);
    if (!schoolId) return responseStatus(res, 400, 'failed', 'Missing schoolId');

    const data = await reportsService.getLibraryReport(schoolId, { startDate: req.query.startDate, endDate: req.query.endDate });
    return responseStatus(res, 200, 'success', data);
  } catch (err) {
    return responseStatus(res, 500, 'failed', err.message || 'Failed to load library report');
  }
};
