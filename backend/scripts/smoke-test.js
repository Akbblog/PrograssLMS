const axios = require('axios')

const API = 'http://localhost:5130/api/v1'

async function run() {
  try {
    console.log('Logging in as SuperAdmin...')
    const loginResp = await axios.post(`${API}/superadmin/login`, { email: 'sa@progresslms.com', password: 'Superpass' })
    console.log('SuperAdmin login response:', JSON.stringify(loginResp.data, null, 2))

    const token = loginResp.data.token
    if (!token) throw new Error('No token returned from superadmin login')

    const createPayload = {
      name: 'Smoke Test School',
      email: 'smoketest-school@example.com',
      phone: '+1 555 999 0000',
      address: { street: '100 Test Ave', city: 'Testville', state: 'TS', country: 'Nowhere', zipCode: '00000' },
      adminName: 'Smoke Admin',
      adminEmail: 'smoke.admin@example.com',
      adminPassword: 'SmokePass123',
      plan: 'trial',
    }

    console.log('Creating school...')
    const createResp = await axios.post(`${API}/superadmin/schools`, createPayload, { headers: { Authorization: `Bearer ${token}` } })
    console.log('Create school response:', JSON.stringify(createResp.data, null, 2))

    console.log('Attempting admin login with created admin credentials...')
    const adminLogin = await axios.post(`${API}/admin/login`, { email: createPayload.adminEmail, password: createPayload.adminPassword })
    console.log('Admin login response:', JSON.stringify(adminLogin.data, null, 2))

    console.log('\nSMOKE TEST SUCCESS')
  } catch (err) {
      console.error('SMOKE TEST ERROR:')
      if (err.response) {
        try {
          console.error('Status:', err.response.status)
          console.error('Data:', JSON.stringify(err.response.data, null, 2))
        } catch (e) {
          console.error('Error while printing response:', e.message)
        }
      } else {
        console.error('Error:', err.message)
        console.error('Error code:', err.code)
        console.error('Cause:', err.cause?.message || 'N/A')
      }
      console.error(err.stack)
    process.exit(1)
  }
}

run()
