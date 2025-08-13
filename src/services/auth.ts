import Cookies from "js-cookie";
import Api from "./api";
import router from "../routes";

interface LoginFormData {
    username: string;
    password: string;
}

interface LoginResponse {
    data: {
        token: string;
        user: {
            name: string;
            email: string;
        };
    };
}

const AuthService = {
    login: async (formData: LoginFormData): Promise<LoginResponse> => {
        try {
            const response = await Api.post('/auth/login', formData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    
    logout: async () => {
        try {
            Cookies.remove("token");
            Cookies.remove("user");
            
            await router.replace({
                name: "login"
            });
            
            return { success: true, message: "Logged out successfully" };
        } catch (error) {
            console.error('Logout error:', error);
            Cookies.remove("token");
            Cookies.remove("user");
            
            await router.replace({
                name: "login"
            });
            
            return { success: true, message: "Logged out successfully" };
        }
    }
}

export default AuthService;