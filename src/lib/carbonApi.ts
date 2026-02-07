/**
 * Carbon Authentication API Client
 * Communicates with the backend server endpoints
 */

export interface CertificateFields {
  project_name?: string;
  vintage?: string;
  country?: string;
  methodology?: string;
}

export interface AuthenticationResult {
  authenticated: boolean;
  confidence: number;
  matched_credit_id: string | null;
  matched_project: any | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/**
 * Extract certificate fields from text
 */
export async function extractCertificateFields(
  text: string
): Promise<CertificateFields> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/carbon/extract`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<CertificateFields> = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to extract certificate fields");
    }

    return result.data || {};
  } catch (error) {
    console.error("[v0] Error extracting certificate fields:", error);
    throw error;
  }
}

/**
 * Authenticate a carbon credit certificate
 */
export async function authenticateCarbonCredit(
  certificate: CertificateFields
): Promise<AuthenticationResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/carbon/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ certificate }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<AuthenticationResult> = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to authenticate certificate");
    }

    return result.data || {
      authenticated: false,
      confidence: 0,
      matched_credit_id: null,
      matched_project: null,
    };
  } catch (error) {
    console.error("[v0] Error authenticating carbon credit:", error);
    throw error;
  }
}

/**
 * Validate certificate data structure
 */
export function validateCertificateData(
  certificate: CertificateFields
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!certificate.project_name || certificate.project_name.trim() === "") {
    errors.push("Project name is required");
  }

  if (!certificate.vintage || !/^\d{4}$/.test(certificate.vintage)) {
    errors.push("Valid vintage year (YYYY) is required");
  }

  if (!certificate.country || certificate.country.trim() === "") {
    errors.push("Country is required");
  }

  if (!certificate.methodology || certificate.methodology.trim() === "") {
    errors.push("Methodology is required");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
