import.meta.env.VITE_API_BASE_URL

export const API_PATHS = {
    AUTH: {
        LOGIN: "/api/v1/auth/login",
        REGISTER: "/api/v1/auth/register",
        GET_USER_INFO: "/api/v1/auth/get-user",
        VERIFY_EMAIL: (verificationToken) => `/api/v1/auth/verify-email?token=${verificationToken}`,
        RESEND_VERIFICATION: "/api/v1/auth/resend-verification",
        CHANGE_PASSWORD: "/api/v1/auth/change-password",
        UPDATE_PROFILE: "/api/v1/auth/update-profile",
        UPDATE_PROFILE_IMAGE: "/api/v1/auth/update-profile-image",
    },
    DASHBOARD: {
        GET_DATA: "/api/v1/dashboard",
    },
    INCOME: {
        ADD_INCOME: '/api/v1/incomes/',
        GET_ALL_INCOME: '/api/v1/incomes/',
        UPDATE_INCOME: (incomeId) => `/api/v1/incomes/${incomeId}`,
        DELETE_INCOME: (incomeId) => `/api/v1/incomes/${incomeId}`,
        DOWNLOAD_INCOME: '/api/v1/incomes/download-excel',
    },
    EXPENSE: {
        ADD_EXPENSE: '/api/v1/expenses/',
        GET_ALL_EXPENSE: '/api/v1/expenses/',
        UPDATE_EXPENSE: (expenseId) => `/api/v1/expenses/${expenseId}`,
        DELETE_EXPENSE: (expenseId) => `/api/v1/expenses/${expenseId}`,
        DOWNLOAD_EXPENSE: '/api/v1/expenses/download-excel',
    },
    IMAGE: {
        UPLOAD_IMAGE: "/api/v1/auth/upload-image",
    }

}