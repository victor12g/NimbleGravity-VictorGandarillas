const BASE_URL = __API_BASE_URL__;
const DEBUG_API = __DEBUG_API__;

if (!BASE_URL) {
  throw new Error('Falta configurar BASE_URL en el archivo .env');
}

const GITHUB_REPO_REGEX = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function debugLog(type, payload) {
  if (!DEBUG_API) {
    return;
  }

  const serialized = JSON.stringify(payload, null, 2);

  if (type === 'ERROR') {
    console.error(`[API ${type}]\n${serialized}`);
    return;
  }

  console.info(`[API ${type}]\n${serialized}`);
}

async function request(path, options = {}) {
  const method = options.method || 'GET';
  const endpoint = `${BASE_URL}${path}`;
  let parsedRequestBody = null;

  if (options.body) {
    try {
      parsedRequestBody = JSON.parse(options.body);
    } catch {
      parsedRequestBody = options.body;
    }
  }

  debugLog('REQUEST', {
    method,
    endpoint,
    body: parsedRequestBody,
  });

  const response = await fetch(endpoint, options);
  const rawBody = await response.text();

  let parsedBody = null;
  try {
    parsedBody = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    parsedBody = null;
  }

  if (!response.ok) {
    const errorMessage =
      parsedBody?.message ||
      parsedBody?.error ||
      rawBody ||
      `Error ${response.status} al llamar a la API.`;

    debugLog('ERROR', {
      method,
      endpoint,
      status: response.status,
      response: parsedBody || rawBody,
    });

    throw new Error(errorMessage);
  }

  debugLog('RESPONSE', {
    method,
    endpoint,
    status: response.status,
    response: parsedBody,
  });

  return parsedBody;
}

export function getCandidateByEmail(email) {
  const encodedEmail = encodeURIComponent(email);
  return request(`/api/candidate/get-by-email?email=${encodedEmail}`);
}

export function getJobs() {
  return request('/api/jobs/get-list');
}

export function applyToJob(payload) {
  return request('/api/candidate/apply-to-job', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function isValidGithubRepoUrl(url) {
  return GITHUB_REPO_REGEX.test(url);
}

export function isValidEmail(email) {
  return EMAIL_REGEX.test(email);
}
