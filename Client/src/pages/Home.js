import { brown } from '@material-ui/core/colors';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import MaterialTable from 'material-table';
import "moment/locale/th";
import * as React from 'react';
import { forwardRef, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Helmet from 'react-helmet';
import { useNavigate } from "react-router-dom";
import Sidebar from '../components/Sidebar';


const theme = createTheme();

export default function SignIn() {

    //Datetime now
    const now = new Date();

    const tableIcons = {
        Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
        Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
        Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
        DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
        Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
        Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
        FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
        LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
        NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
        ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
        SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
        ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
        ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
    }
    const [data, setData] = useState([])

    const [columns, setColumns] = useState([
        {
            title: 'Id',
            field: 'id',
            editable: 'never',
            cellStyle: {
                textAlign: 'center',
                width: 50,
                border: '1px solid #ddd',
            },
            hidden: true,

        },
        {
            title: 'Name',
            field: 'name',
            cellStyle: {
                textAlign: 'center',
                border: '1px solid #ddd',

            },
            editComponent: props => (
                <TextField
                    value={props.value}
                    onChange={e => props.onChange(e.target.value)}
                    error={props.error}
                    helperText={props.helperText}
                />),
            // validate: rowData => rowData.name === undefined || rowData.name === "" ? "Required" : true
        },
        {
            title: 'When',
            field: 'when',
            type: 'datetime',
            cellStyle: {
                textAlign: 'center',
                border: '1px solid #ddd',

            },
            //th date
            locale: 'th-TH',
            //DD Month YYYY
            render: rowData => rowData.when === undefined ? "" :
                new Date(rowData.when).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }),

            /*  */
            editComponent: props => (

                <LocalizationProvider dateAdapter={AdapterDateFns}
                >
                    {/* Th date picker */}
                    <DateTimePicker
                        label="When"
                        locale="th-TH"
                        inputFormat="dd/MM/yyyy HH:mm"
                        pickerHeaderFormat="dd/MMMM/yyyy HH:mm"
                        value={props.value === undefined ? now : props.value}
                        onChange={(newValue) => {
                            props.onChange(newValue);
                        }
                        }
                        renderInput={(params) =>
                            <TextField {...params}
                            />}
                    />
                </LocalizationProvider>
            )

        },

    ]);

    //check login token
    const [cookies, setCookie] = useCookies(['token'])

    const [openError, setOpenError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [openSuccess, setOpenSuccess] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState("");
    const [openWarning, setOpenWarning] = React.useState(false);
    const [warningMessage, setWarningMessage] = React.useState("");

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
    const handleCloseWarning = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenWarning(false);
    };

    let navigate = useNavigate()
    //Check if user is logged in
    useEffect(() => {
        if (!cookies.token) {
            navigate("/")
        }

        axios.get('http://localhost:5000/Activities', {
            // headers: {
            //     'Authorization': `Bearer ${cookies.token}`
            // }
        })
            .then(res => {
                setData(res.data)
                console.log(res.data)
            })
            .catch(err => {
                console.log(err)
            })


        return () => { };
    }, []);



    //add data to database
    const addData = (newData) => {

        return new Promise((resolve, reject) => {
            if (newData.name === '' || newData.name === undefined || newData.when === undefined || newData.when === '' || newData.when === null) {
                setWarningMessage("กรุณากรอกข้อมูลให้ครบ")
                setOpenWarning(true)
                reject()
            }
            else {
                axios.post('http://localhost:5000/Activities/add', newData, {
                    headers: {
                        'Authorization': `Bearer ${cookies.token}`
                    }
                })
                    .then(res => {
                        setSuccessMessage("เพิ่มข้อมูลสำเร็จ")
                        setOpenSuccess(true)
                        setData([...data, res.data])
                        resolve()
                    })
                    .catch(err => {
                        setErrorMessage("เพิ่มข้อมูลไม่สำเร็จ")
                        setOpenError(true)
                        reject()
                    })
            }


        })

    }

    //update data to database
    const updateData = (newData, oldData) => {

        return new Promise((resolve, reject) => {
            console.log(newData)
            if (newData.name === '' || newData.name === undefined || newData.when === undefined || newData.when === '' || newData.when === null) {
                setWarningMessage("กรุณากรอกข้อมูลให้ครบ")
                setOpenWarning(true)
                reject()
            }
            else {
                axios.put(`http://localhost:5000/Activities/${oldData.id}`, newData, {
                    headers: {
                        'Authorization': `Bearer ${cookies.token}`
                    }
                })
                    .then(res => {
                        const dataUpdate = [...data];
                        const index = oldData.tableData.id;
                        dataUpdate[index] = newData;
                        setSuccessMessage("แก้ไขข้อมูลสำเร็จ")
                        setOpenSuccess(true)
                        setData([...dataUpdate]);
                        resolve()
                    })
                    .catch(err => {
                        setErrorMessage("ไม่สามารถแก้ไขข้อมูลได้")
                        setOpenError(true)
                        reject()
                    })
            }




        })

    }

    //delete data to database
    const deleteData = (oldData) => {
        return new Promise((resolve, reject) => {

            axios.delete(`http://localhost:5000/Activities/${oldData.id}`, {
                headers: {
                    'Authorization': `Bearer ${cookies.token}`
                }
            })
                .then(res => {
                    const dataDelete = [...data];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);
                    setSuccessMessage("ลบข้อมูลสำเร็จ")
                    setOpenSuccess(true)
                    setData([...dataDelete]);
                    resolve()
                })
                .catch(err => {
                    setErrorMessage("ไม่สามารถลบข้อมูลได้")
                    setOpenError(true)
                    console.log(err)
                    reject()
                })

        })

    }

    return (

        <ThemeProvider theme={theme}>
            <Helmet>
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
            </Helmet>
            <div id="outer-container">
                <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
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
                        {errorMessage}</Alert>
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
                        {successMessage}</Alert>
                </Snackbar>

                <Snackbar
                    open={openWarning}
                    autoHideDuration={5000}
                    onClose={handleCloseWarning}
                    anchorOrigin={{ vertical, horizontal }}
                >
                    <Alert
                        onClose={handleCloseWarning}
                        severity="warning"
                        sx={{ width: '100%' }}>
                        {warningMessage}</Alert>
                </Snackbar>
                <div id="page-wrap">
                    {/* head */}
                    <div className="head">
                        <center className="head__title">
                            <h1>Activities</h1>
                        </center>
                    </div>
                    {/* width */}

                    <MaterialTable
                        icons={tableIcons}
                        columns={columns}
                        data={data}
                        localization={{ body: { editRow: { deleteText: 'ยืนยันการลบข้อมูล' } } }}
                        editable={{
                            onRowAddCancelled: rowData => console.log('Row adding cancelled'),
                            onRowUpdateCancelled: rowData => console.log('Row editing cancelled'),
                            onRowAdd: newData =>
                                //get not edit cell
                                addData(newData),
                            onRowUpdate: (newData, oldData) =>
                                updateData(newData, oldData),
                            onRowDelete: oldData =>
                                //delete text
                                deleteData(oldData)
                        }}
                        width="60%"
                        options={{
                            actionsColumnIndex: -1,
                            headerStyle: {
                                backgroundColor: '#01579b',
                                color: '#FFF',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                border: '1px solid #FFFFFF'

                            },
                            rowStyle: {
                                backgroundColor: '#EEE',

                            },
                            //Hide title
                            search: true,
                            //hide title
                            showTitle: false,

                        }}
                    />



                </div>
            </div>
        </ThemeProvider >

    );
}