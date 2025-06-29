import Cookies from "js-cookie";
import { useRouter } from "vue-router";

// composable useLogout
export const useLogout = (): (() => void) => {
    // initialize router
    const router = useRouter();

    // function logout
    const logout = (): void => {
        // remove token and user from cookie
        Cookies.remove("token")
        Cookies.remove("user")

        // redirect to login
        router.push({name: 'login'})
    };

    return logout;
}