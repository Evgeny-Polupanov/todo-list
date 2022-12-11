import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import { Typography } from '@mui/material'

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Todo List</title>
                <meta name="description" content="Todo List" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <Typography variant="h2" gutterBottom>Welcome</Typography>
            </main>
        </div>
    )
}
