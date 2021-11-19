import Modal from '@material-ui/core/Modal';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import { useTodoItems } from './TodoItemsContext';

const useModalAddTagStyles = makeStyles({
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
    }
});

const ModalAddTag = (
    { id, open, handleClose }: { id: string, open: boolean, handleClose: () => void }
) => {
    const classes = useModalAddTagStyles();
    const { control, handleSubmit, reset } = useForm();
    const { dispatch } = useTodoItems();

    return (
        <Modal open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            className={classes.root}
        >
            <Box className={classes.box}>
                <Typography id="modal-title" variant="h5" component="h2">
                    Add tag
                </Typography>
                <form
                    onSubmit={handleSubmit(({ tag }) => {
                        dispatch({ type: 'addTag', data: { todoId: id, tag } });
                        reset({ tag: '' });
                        handleClose();
                    })}
                >
                    <Controller
                        name="tag"
                        control={control}
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Type tag"
                                fullWidth={true}
                            />
                        )}
                    />
                </form>
            </Box>
        </Modal>
    );
};

export default ModalAddTag;
