import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import { Box, Button, Tab, Tabs, TextField, Typography } from '@mui/material'
import { useState } from 'react'

enum Mode {
    Signin,
    Signup,
}

export default function Home() {
    const [mode, setMode] = useState(Mode.Signin)

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
                        <>
                            <TextField
                                type="email"
                                variant="outlined"
                                fullWidth
                                placeholder="Enter your email"
                                sx={{ marginBottom: 3 }}
                                autoFocus
                                required
                                label="Email"
                            />
                            <TextField
                                type="password"
                                variant="outlined"
                                fullWidth
                                placeholder="Enter your password"
                                sx={{ marginBottom: 3 }}
                                required
                                label="Password"
                            />
                            <Button variant="contained" fullWidth>Sign in</Button>
                        </>
                    )}
                    {mode === Mode.Signup && (
                        <>
                            <TextField
                                type="email"
                                variant="outlined"
                                fullWidth
                                placeholder="Enter your email"
                                sx={{ marginBottom: 3 }}
                                autoFocus
                                required
                            />
                            <TextField
                                variant="outlined"
                                fullWidth
                                placeholder="Enter your name"
                                sx={{ marginBottom: 3 }}
                                required
                            />
                            <TextField
                                type="password"
                                variant="outlined"
                                fullWidth
                                placeholder="Enter your password"
                                sx={{ marginBottom: 3 }}
                                required
                            />
                            <Button variant="contained" fullWidth>Sign up</Button>
                        </>
                    )}
                </Box>
            </main>
        </div>
    )
}
