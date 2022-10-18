//log out
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";


export default function SignOut() {
    const [cookies, setCookie, removeCookie] = useCookies(['token'])
    let navigate = useNavigate()
    useEffect(() => {
        removeCookie('token', { path: '/' })
        navigate("/sign-in")
    }, [])
    return (
        <div>

        </div>
    )
}