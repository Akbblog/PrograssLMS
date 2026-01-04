(async () => {
  try {
    const gen = require('../services/documentGenerator');
    const buf = await gen.generateFeeVoucher({});
    console.log('Result type:', typeof buf);
    console.log('Is Buffer:', Buffer.isBuffer(buf));
    console.log('Has length?:', buf ? buf.length : null);
  } catch (err) {
    console.error('Error generating PDF:', err);
  }
})();
