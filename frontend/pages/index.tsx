import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import { Box, Typography } from '@mui/material'
import { GetTodosDocument, GetUserForHomeDocument, Todo } from '../src/gql/graphql'
import { useEffect } from 'react'
import { useQuery } from '@apollo/client'

const Home = () => {
    const { data: todosData, refetch } = useQuery(GetTodosDocument)
    const { data: userData } = useQuery(GetUserForHomeDocument)

    return (
        <div className={styles.container}>
            <Head>
                <title>Todo List</title>
                <meta name="description" content="Todo List" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <Typography variant="h2" gutterBottom>Welcome, {userData?.getUser.name}!</Typography>
                <Typography variant="subtitle1" gutterBottom>Here's the list of your todos:</Typography>
                <Box sx={{
                    width: 500,
                    height: 600,
                    marginTop: 4,
                }}>
                    {todosData?.getTodos.map((todo) => (
                        <Typography variant="subtitle1">{todo.content}</Typography>
                    ))}
                </Box>
            </main>
        </div>
    )
}

export default Home
