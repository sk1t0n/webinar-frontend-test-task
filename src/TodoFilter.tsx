import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import { useTodoItems } from './TodoItemsContext';
import { CardContent, Typography } from '@material-ui/core';

const useFilterStyles = makeStyles({
    root: {
        padding: 24,
        margin: "24px 0px"
    },
    title: {
        marginBottom: 10,
    },
    button: {
        marginTop: 10,
    },
});

export default function TodoFilter() {
    const { dispatch } = useTodoItems();
    const { control, handleSubmit, reset } = useForm();
    const classes = useFilterStyles();

    const resetFilter = (e: React.MouseEvent) => {
        dispatch({ type: 'resetFilter', data: null })
    };

    return (
        <form
            onSubmit={handleSubmit((data) => {
                dispatch({ type: 'filterByTag', data });
                reset({ tag: '' });
            })}
        >
            <Card className={classes.root}>
                <CardContent>
                    <Typography
                        variant="h5"
                        component="h2"
                        className={classes.title}
                    >
                        Filter by tag
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item md={8} sm={12} xs={12}>
                            <Controller
                                name="tag"
                                control={control}
                                defaultValue=""
                                rules={{ required: false }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Type tag"
                                        fullWidth={true}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item md={4} sm={12} xs={12}>
                            <Button
                                variant="outlined"
                                className={classes.button}
                                onClick={resetFilter}
                            >
                                Reset filter
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </form >
    );
};