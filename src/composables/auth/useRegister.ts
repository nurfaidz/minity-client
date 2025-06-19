import { useMutation } from "@tanstack/vue-query";
import { Api } from "../../services/api";

// interface RegisterRequest
interface RegisterRequest {
    username: string,
    name: string,
    email: string,
    password: string
}

export const useRegister = () => {
    return useMutation({
        // mutate for register
        mutationFn:async (data: RegisterRequest) => {
            // using API service for register
            const response = await Api.post('/register', data);

            // return the response data
            return response.data;
        }
    })
}