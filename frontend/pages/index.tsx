import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import { Box, IconButton, Stack, TextField, Tooltip, Typography, CircularProgress } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import {
    DeleteTodoDocument,
    GetTodosDocument,
    GetUserForHomeDocument,
    PostTodoDocument,
    TodoInput,
    ToggleTodoDocument,
} from '../src/gql/graphql'
import { useEffect, useRef } from 'react'
import { ApolloError, useMutation, useQuery } from '@apollo/client'
import { theme } from '../theme'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSnackbar } from 'notistack'

const schema = yup.object({
    content: yup.string().required(),
}).required()

const Home = () => {
    const todoInputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        todoInputRef.current?.focus()
    }, [])

    const { enqueueSnackbar } = useSnackbar()

    const { register, handleSubmit, reset: resetTodoForm } = useForm<TodoInput>({
        resolver: yupResolver(schema),
    })

    const onError = (error: ApolloError) => {
        enqueueSnackbar(error.message, { variant: 'error' })
    }

    const { data: todosData, refetch, loading: isEachTodoLoading } = useQuery(GetTodosDocument, { onError })
    const { data: userData } = useQuery(GetUserForHomeDocument, { onError })
    const [postTodo, { loading: isPostingTodo }] = useMutation(PostTodoDocument, { onError })
    const [toggleTodo, { loading: isTogglingTodo }] = useMutation(ToggleTodoDocument, { onError })
    const [deleteTodo, { loading: isDeletingTodo }] = useMutation(DeleteTodoDocument, { onError })

    const postTodoHandler: SubmitHandler<TodoInput> = async (data) => {
        try {
            await postTodo({
                variables: {
                    todoInput: {
                        content: data.content,
                    },
                },
            })
            await refetch()
            resetTodoForm()
        } catch (error) {
            console.error(error)
        }
    }

    const toggleTodoHandler = async (todoId: string) => {
        try {
            await toggleTodo({
                variables: {
                    todoId,
                },
            })
            await refetch()
        } catch (error) {
            console.error(error)
        }
    }

    const deleteTodoHandler = async (todoId: string) => {
        try {
            await deleteTodo({
                variables: {
                    todoId,
                },
            })
            await refetch()
        } catch (error) {
            console.error(error)
        }
    }

    const isLoading = isEachTodoLoading || isPostingTodo || isTogglingTodo || isDeletingTodo

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
                    height: 500,
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                }}>
                    {isLoading && <CircularProgress />}
                    {!isLoading && todosData?.getTodos.length === 0 && (
                        <Typography variant="subtitle1">No todos so far</Typography>
                    )}
                    <Stack spacing={2}>
                        {todosData?.getTodos.map((todo) => (
                            <Box
                                key={todo._id}
                                sx={{
                                    height: 56,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '24px',
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: '8px',
                                    padding: '10px',
                                    cursor: 'pointer',
                                }}
                                onClick={() => toggleTodoHandler(todo._id)}
                            >
                                <Tooltip title={todo.content}>
                                    <Typography
                                        variant="subtitle1"
                                        style={{
                                            whiteSpace: 'nowrap',
                                            overflowX: 'hidden',
                                            textOverflow: 'ellipsis',
                                            textDecoration: todo.isDone ? 'line-through' : 'none',
                                        }}
                                    >
                                        {todo.content}
                                    </Typography>
                                </Tooltip>
                                <Tooltip title="Delete the todo">
                                    <IconButton
                                        onClick={(event) => {
                                            event.preventDefault()
                                            return deleteTodoHandler(todo._id)
                                        }}
                                        aria-label="delete"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        ))}
                    </Stack>
                </Box>
                <form
                    style={{
                        width: 500,
                        marginTop: 4,
                    }}
                    onSubmit={handleSubmit(postTodoHandler)}
                >
                    <TextField
                        variant="outlined"
                        fullWidth
                        placeholder="Enter a new todo"
                        autoFocus
                        inputProps={{ ...register('content') }}
                        inputRef={todoInputRef}
                    />
                </form>
            </main>
        </div>
    )
}

export default Home
