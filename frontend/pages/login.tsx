import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import { Box, Button, Tab, Tabs, TextField, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ApolloError, useLazyQuery, useMutation } from '@apollo/client'
import { SignupDocument, LoginDocument } from '../src/gql/graphql'
import { useRouter } from 'next/router'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSnackbar } from 'notistack'

enum Mode {
    Signin,
    Signup,
}

interface Signin {
    email: string;
    password: string;
}
const signinSchema = yup.object({
    email: yup.string().required(),
    password: yup.string().required(),
}).required()

interface Signup {
    email: string;
    name: string;
    password: string;
    passwordConfirm: string;
}
const signupSchema = yup.object({
    email: yup.string().required(),
    name: yup.string().required(),
    password: yup.string().min(6).required(),
    passwordConfirm: yup.string().oneOf([yup.ref('password')], 'Passwords don\'t match.').required(),
}).required()

export default function Login() {
    const [mode, setMode] = useState(Mode.Signin)
    const router = useRouter()
    const { enqueueSnackbar } = useSnackbar()

    const emailInputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        emailInputRef.current?.focus()
    }, [])

    const onError = (error: ApolloError) => {
        enqueueSnackbar(error.message, { variant: 'error' })
    }

    const [signin, { loading: isSigninLoading }] = useLazyQuery(LoginDocument, { onError })
    const {
        register: registerSignin,
        handleSubmit: handleSignin,
    } = useForm<Signin>({
        resolver: yupResolver(signinSchema),
    })
    const submitSignin: SubmitHandler<Signin> = (data) => {
        signin({
            variables: {
                userInput: {
                    email: data.email,
                    password: data.password,
                },
            },
        })
            .then((response) => {
                const token = response.data?.login.token
                if (token) {
                    enqueueSnackbar('You\'ve successfully logged in.', { variant: 'success' })
                    localStorage.setItem('jwt-token', token)
                    return router.push('/')
                }
            })
            .catch((error) => console.error(error))
    }

    const [signup, { loading: isSignupLoading }] = useMutation(SignupDocument, { onError })
    const {
        register: registerSignup,
        handleSubmit: handleSignup,
        formState: { errors: signupValidationErrors },
        reset: resetSignupForm,
    } = useForm<Signup>({
        resolver: yupResolver(signupSchema),
    })
    const submitSignup: SubmitHandler<Signup> = (data) => {
        signup({
            variables: {
                userInput: {
                    email: data.email,
                    name: data.name,
                    password: data.password,
                },
            },
        })
            .then(() => {
                enqueueSnackbar('You\'ve successfully signed up. Now log in.', { variant: 'success' })
                resetSignupForm()
                setMode(Mode.Signin)
            })
            .catch((error) => console.error(error))
    }
    useEffect(() => {
        const validationErrors = Object.values(signupValidationErrors)
        if (validationErrors.length > 0) {
            validationErrors.forEach((error) => {
                enqueueSnackbar(error.message, { variant: 'error' })
            })
        }
    }, [signupValidationErrors, enqueueSnackbar])

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
                                inputRef={emailInputRef}
                                disabled={isSigninLoading}
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
                                disabled={isSigninLoading}
                            />
                            <Button
                                variant="contained"
                                type="submit"
                                fullWidth
                                disabled={isSigninLoading}
                            >
                                Sign in
                            </Button>
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
                                disabled={isSignupLoading}
                                error={!!signupValidationErrors.email?.message}
                                aria-errormessage={signupValidationErrors.email?.message}
                            />
                            <TextField
                                variant="outlined"
                                fullWidth
                                placeholder="Enter your name"
                                sx={{ marginBottom: 3 }}
                                required
                                label="Name"
                                inputProps={{ ...registerSignup('name') }}
                                disabled={isSignupLoading}
                                error={!!signupValidationErrors.name?.message}
                                aria-errormessage={signupValidationErrors.name?.message}
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
                                disabled={isSignupLoading}
                                error={!!signupValidationErrors.password?.message}
                                aria-errormessage={signupValidationErrors.password?.message}
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
                                disabled={isSignupLoading}
                                error={!!signupValidationErrors.passwordConfirm?.message}
                                aria-errormessage={signupValidationErrors.passwordConfirm?.message}
                            />
                            <Button
                                variant="contained"
                                type="submit"
                                fullWidth
                                disabled={isSignupLoading}
                            >
                                Sign up
                            </Button>
                        </form>
                    )}
                </Box>
            </main>
        </div>
    )
}
