import Modal from '@material-ui/core/Modal';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { TodoItem, useTodoItems } from './TodoItemsContext';

const useModalEditTodoItemStyles = makeStyles({
    root: {
        opacity: 1,
        backgroundColor: '#ccc',
    },
    box: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        border: '2px solid #000',
        padding: 24,
    },
    input: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    header: {
        marginBottom: 10,
    }
});

const ModalEditTodo = (
    { item, open, handleClose }: { item: TodoItem, open: boolean, handleClose: () => void }
) => {
    const classes = useModalEditTodoItemStyles();
    const { control, handleSubmit } = useForm();
    const { dispatch } = useTodoItems();

    return (
        <Modal open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            className={classes.root}
        >
            <Box className={classes.box}>
                <Typography
                    id="modal-title"
                    variant="h5"
                    component="h2"
                    className={classes.header}
                >
                    Edit todo
                </Typography>
                <form
                    onSubmit={handleSubmit((dataForm) => {
                        dispatch({
                            type: 'edit',
                            data: {
                                todoItem: {
                                    id: item.id,
                                    done: dataForm.done,
                                    title: dataForm.title,
                                    details: dataForm.details,
                                    tag: dataForm.deleteTag ? undefined : item.tag
                                }
                            }
                        });
                        handleClose();
                    })}
                >
                    <Controller
                        name="title"
                        control={control}
                        defaultValue={item.title}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Type title"
                                className={classes.input}
                                fullWidth={true}
                            />
                        )}
                    />
                    <Controller
                        name="details"
                        control={control}
                        defaultValue={item.details}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Type details"
                                className={classes.input}
                                fullWidth={true}
                            />
                        )}
                    />
                    <Controller
                        name="done"
                        control={control}
                        rules={{ required: false }}
                        defaultValue={item.done}
                        render={({ field: { onBlur, onChange, value, name, ref } }) => (
                            <div>
                                <label>
                                    <Checkbox
                                        onBlur={onBlur}
                                        onChange={onChange}
                                        checked={value}
                                        innerRef={ref}
                                        name={name}
                                    />
                                    done
                                </label>
                            </div>
                        )}
                    />
                    <Controller
                        name="deleteTag"
                        control={control}
                        rules={{ required: false }}
                        defaultValue={false}
                        render={({ field: { onBlur, onChange, value, name, ref } }) => (
                            <div>
                                <label>
                                    <Checkbox
                                        onBlur={onBlur}
                                        onChange={onChange}
                                        checked={value}
                                        innerRef={ref}
                                        name={name}
                                    />
                                    delete tag
                                </label>
                            </div>
                        )}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth={true}
                    >
                        Edit todo
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default ModalEditTodo;
