import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import { Box, Button, Tab, Tabs, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

enum Mode {
    Signin,
    Signup,
}

interface Signin {
    email: string;
    password: string;
}

interface Signup {
    email: string;
    name: string;
    password: string;
    passwordConfirm: string;
}

export default function Home() {
    const [mode, setMode] = useState(Mode.Signin)

    const { register: registerSignin, handleSubmit: handleSignin } = useForm<Signin>()
    const submitSignin: SubmitHandler<Signin> = (data) => console.log(data)

    const { register: registerSignup, handleSubmit: handleSignup } = useForm<Signup>()
    const submitSignup: SubmitHandler<Signup> = (data) => console.log(data)

    return (
        <div className={styles.container}>
            <Head>
                <title>Todo List</title>
                <meta name="description" content="Todo List" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <Typography variant="h2" gutterBottom>Welcome to a todo list service</Typography>
                <Typography variant="subtitle1" gutterBottom>Please sign in to proceed</Typography>
                <Box sx={{
                    width: 330,
                    height: 500,
                    marginTop: 3,
                }}>
                    <Box sx={{
                        marginBottom: 3,
                    }}>
                        <Tabs
                            value={mode}
                            onChange={(event, mode) => setMode(mode)}
                            variant="fullWidth"
                            aria-label="Authorization modes"
                        >
                            <Tab label="Sign in" value={Mode.Signin} />
                            <Tab label="Sign up" value={Mode.Signup} />
                        </Tabs>
                    </Box>
                    {mode === Mode.Signin && (
                        <form onSubmit={handleSignin(submitSignin)}>
                            <TextField
                                type="email"
                                variant="outlined"
                                fullWidth
                                placeholder="Enter your email"
                                sx={{ marginBottom: 3 }}
                                autoFocus
                                required
                                label="Email"
                                inputProps={{ ...registerSignin('email') }}
                            />
                            <TextField
                                type="password"
                                variant="outlined"
                                fullWidth
                                placeholder="Enter your password"
                                sx={{ marginBottom: 3 }}
                                required
                                label="Password"
                                inputProps={{ ...registerSignin('password') }}
                            />
                            <Button variant="contained" type="submit" fullWidth>Sign in</Button>
                        </form>
                    )}
                    {mode === Mode.Signup && (
                        <form onSubmit={handleSignup(submitSignup)}>
                            <TextField
                                type="email"
                                variant="outlined"
                                fullWidth
                                placeholder="Enter your email"
                                sx={{ marginBottom: 3 }}
                                autoFocus
                                required
                                label="Email"
                                inputProps={{ ...registerSignup('email') }}
                            />
                            <TextField
                                variant="outlined"
                                fullWidth
                                placeholder="Enter your name"
                                sx={{ marginBottom: 3 }}
                                required
                                label="Name"
                                inputProps={{ ...registerSignup('name') }}
                            />
                            <TextField
                                type="password"
                                variant="outlined"
                                fullWidth
                                placeholder="Enter your password"
                                sx={{ marginBottom: 3 }}
                                required
                                label="Password"
                                inputProps={{ ...registerSignup('password') }}
                            />
                            <TextField
                                type="password"
                                variant="outlined"
                                fullWidth
                                placeholder="Repeat your password"
                                sx={{ marginBottom: 3 }}
                                required
                                label="Password confirm"
                                inputProps={{ ...registerSignup('passwordConfirm') }}
                            />
                            <Button variant="contained" type="submit" fullWidth>Sign up</Button>
                        </form>
                    )}
                </Box>
            </main>
        </div>
    )
}
