import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MuiAlert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Snackbar from '@mui/material/Snackbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import * as React from 'react';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";


const theme = createTheme();

export default function SignIn() {

    //Set up state variables
    const [id, setId] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);

    const [cookies, setCookie, removeCookie] = useCookies(['token'])
    const [openError, setOpenError] = React.useState(false);
    const [openSuccess, setOpenSuccess] = React.useState(false);
    const vertical = 'top';
    const horizontal = 'right';
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    const handleCloseError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenError(false);
    };
    const handleCloseSuccess = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccess(false);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    let navigate = useNavigate()

    useEffect(() => {
        if (cookies.token) {
            navigate("/home")
        }

    }, [])
    //Check if user is logged in

    const handleSubmit = (event) => {
        event.preventDefault();
        // axios
        axios.post('http://localhost:5000/Activities/login', {
            id: id,
            password: password
        })
            .then(function (response) {
                console.log(response);
                if (response.data.status === 404) {
                    setOpenError(true);
                    //remove cookie
                    removeCookie('token', { path: '/' })
                }
                else if (response.data.status === 200) {
                    setOpenSuccess(true);
                    //timeout for 1 seconds
                    setTimeout(() => {
                        //set cookie
                        removeCookie('token', { path: '/' })
                        setCookie('token', response.data.token, { path: '/' })
                        navigate("/home")
                    }, 1000);

                }

            })
            .catch(function (error) {
                setOpenError(true);
                console.log(error);
            });



    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <Snackbar
                    open={openError}
                    autoHideDuration={5000}
                    onClose={handleCloseError}
                    anchorOrigin={{ vertical, horizontal }}
                >
                    <Alert
                        onClose={handleCloseError}
                        severity="error"
                        sx={{ width: '100%' }}>
                        ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง</Alert>
                </Snackbar>

                <Snackbar
                    open={openSuccess}
                    autoHideDuration={5000}
                    onClose={handleCloseSuccess}
                    anchorOrigin={{ vertical, horizontal }}
                >
                    <Alert
                        onClose={handleCloseSuccess}
                        severity="success"
                        sx={{ width: '100%' }}>
                        ลงชื่อเข้าใช้สำเร็จ</Alert>
                </Snackbar>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Id"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={(e) => setId(e.target.value)

                            }
                        />
                        <FormControl required fullWidth variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="sign-up" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}