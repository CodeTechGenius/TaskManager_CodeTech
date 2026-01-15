
let serverUrl = `http://localhost:5173`

const adminLogin = async ({ email, password, role }) => {
  try {
    const params = { email, password, role };

    const response = await fetch(`${serverUrl}/api/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: 1,
        errorMsg: result?.error || 'Login failed',
        token: null,
        user: null
      };
    }

    const { error, errorMsg, token, user } = result;

    return {
      error: error ?? 0,
      errorMsg: errorMsg ?? null,
      token,
      user
    };
  } catch (e) {
    console.error('Error in admin login:', e);

    return {
      error: -1,
      errorMsg: e.message || 'Unexpected error occurred',
      token: null,
      user: null
    };
  }
};

const getEmployees = async ({}) => {
  try {
    let response = await fetch(`${serverUrl}/api/employee`)

    let result = await response.json()
    if (!response.ok) {

      return { error: -1, errorMsg: result.error }
    }
    let { success, source, data } = result
    return { error: 0, errorMsg: '', data }
  } catch (e) {
    console.log('error getEmployee', e)
    return { error: -1, errorMsg: e }
  }
}

const addEmployee = async ({ newEmployee }) => {
  try {

    const response = await fetch(`${serverUrl}/api/employee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newEmployee)
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: 1,
        errorMsg: result?.error,
      };
    }

    let { success, source, data } = result
    return {
      error: 0,
      errorMsg: '',
      data
    };
  } catch (e) {
    console.error('Error in admin login:', e);

    return {
      error: -1,
      errorMsg: e.message || 'Unexpected error occurred',
    };
  }
};

const getEmployeeForId = async ({ employeeId }) => {
  try {
    let response = await fetch(`${serverUrl}/api/employee/${employeeId}`)

    const result = await response.json();

    if (!response.ok) {
      return {
        error: 1,
        errorMsg: result?.error,
      };
    }

    let { success, source, data } = result
    return {
      error: 0,
      errorMsg: '',
      data
    };
  } catch (e) {
    console.log('error in getEmployeeId',e)
    return {
      error:-1,errorMsg:e
    }
  }
}

export let api = {
  adminLogin,
  getEmployees,
  addEmployee,
  getEmployeeForId
}