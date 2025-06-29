import Cookies from "js-cookie";

// interface user
interface User {
    id: number;
    name: string;
    username: string;
    password: string;
}

export const useAuthUser = (): User | null => {
    // get user data from cookie
    const user = Cookies.get("user");

    // If data exists (is truthy), it tries to parse it as JSON and returns the object.
    // If data is null, undefined, or empty, it returns null.
    return user ? JSON.parse(user) as User : null
}