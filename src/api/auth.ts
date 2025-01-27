import axios from "axios";
import { API_URL } from "@/constants";

interface LoginResponse {
  jwt: string; // Токен для авторизации
  user: {
    id: number;
    username: string;
    email: string;
  };
}

interface LoginError {
  status: number;
  message: string;
}

export const loginRequest = async (
  identifier: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/api/auth/local`,
      {
        identifier,
        password,
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Если сервер вернул ошибку
      const serverError: LoginError = {
        status: error.response.status,
        message: error.response.data.error.message || "Login failed",
      };

      throw serverError;
    }

    // Если ошибка на уровне сети или другой тип
    throw new Error("An unexpected error occurred. Please try again.");
  }
};
