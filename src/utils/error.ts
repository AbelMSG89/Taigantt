export const handleApiError = (error: any): string => {
  if (error.response?.status === 401) {
    const apiError = error.response.data;
    if (apiError.code === 'invalid_credentials') {
      return 'No active account found with the given credentials';
    } else if (apiError.message) {
      return apiError.message;
    } else {
      return 'Unauthorized. Please check your credentials.';
    }
  } else if (error.response?.data?.message) {
    return error.response.data.message;
  } else if (error.response?.data) {
    return 'An error occurred. Please try again.';
  }
  return 'Connection error. Please try again.';
};

export const createError = (message: string): Error => {
  return new Error(message);
};