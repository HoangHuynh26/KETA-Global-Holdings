const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function submitBusinessInquiry(inquiryData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(inquiryData)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.errors = data.errors;
      throw err;
    }

    return data;
  } catch (error) {
    console.error('Inquiry submission error:', error);
    throw error;
  }
}
