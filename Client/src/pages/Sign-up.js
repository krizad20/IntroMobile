import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MuiAlert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
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
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";

const theme = createTheme();

export default function SignUp() {
    let navigate = useNavigate()
    const [cookies, setCookie, removeCookie] = useCookies(['token'])

    const [id, setId] = React.useState("");
    //Show Hide Password
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);

    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    //Snackbar
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    const [openError, setOpenError] = React.useState(false);
    const [ErrorMessage, setErrorMessage] = React.useState("");
    const [openSuccess, setOpenSuccess] = React.useState(false);
    const vertical = 'top';
    const horizontal = 'right';
    
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
    const handleMouseDown = (event) => {
        event.preventDefault();
    };
    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };



    const handleSubmit = (event) => {
        event.preventDefault();

        if (password === '' || id === '' || confirmPassword === '') {
            setErrorMessage("กรุณากรอกข้อมูลให้ครบถ้วน")
            setOpenError(true);
        }

        if (password !== confirmPassword) {
            setErrorMessage("รหัสผ่านไม่ตรงกัน")
            setOpenError(true)
            removeCookie('token', { path: '/' })
            return;
        }


        axios.post('http://localhost:5000/Activities/signup', {
            id: id,
            password: password
        })
            .then(function (response) {
                setOpenSuccess(true)
                //remove cookie
                setTimeout(() => {
                    removeCookie('token', { path: '/' })
                    setCookie('token', response.data.token, { path: '/' })
                    navigate("/home")
                }, 1000);

            })
            .catch(function (error) {
                //console.log(error);
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
                        sx={{ width: '100%' }}
                    >
                        {ErrorMessage}</Alert>
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
                        สมัครเข้าใช้งานสำเร็จ</Alert>
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
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="id"
                                    label="Id"
                                    name="id"
                                    autoComplete="id"
                                    onChange={(e) => setId(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
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
                                                    onMouseDown={handleMouseDown}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl required fullWidth variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        fullWidth
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowConfirmPassword}
                                                    onMouseDown={handleMouseDown}
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Confirm Password"
                                    />
                                </FormControl>
                            </Grid>

                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/sign-in" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}