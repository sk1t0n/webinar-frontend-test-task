import { useCallback, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Chip from '@material-ui/core/Chip';
import ModalAddTag from './AddTagToTodoItem';
import ModalEditTodo from './EditTodoItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { motion } from 'framer-motion';
import { TodoItem, useTodoItems } from './TodoItemsContext';

const spring = {
    type: 'spring',
    damping: 25,
    stiffness: 120,
    duration: 0.25,
};

const useTodoItemListStyles = makeStyles({
    root: {
        listStyle: 'none',
        padding: 0,
    },
});

export const TodoItemsList = function () {
    const { todoItems, filteredTodoItems } = useTodoItems();
    const classes = useTodoItemListStyles();

    const sortedItems = todoItems.slice().sort((a, b) => {
        if (a.done && !b.done) {
            return 1;
        }

        if (!a.done && b.done) {
            return -1;
        }

        return 0;
    });

    const items = filteredTodoItems.length > 0 ? filteredTodoItems : sortedItems;

    return (
        <ul className={classes.root}>
            {items.map((item) => (
                <motion.li key={item.id} transition={spring} layout={true}>
                    <TodoItemCard item={item} />
                </motion.li>
            ))}
        </ul>
    );
};

const useTodoItemCardStyles = makeStyles({
    root: {
        marginTop: 24,
        marginBottom: 24,
    },
    doneRoot: {
        textDecoration: 'line-through',
        color: '#888888',
    },
    content: {
        display: 'flex',
        justifyContent: 'space-between',
    },
});

export const TodoItemCard = function ({ item }: { item: TodoItem }) {
    const classes = useTodoItemCardStyles();
    const { dispatch } = useTodoItems();

    const handleDelete = useCallback(
        () => dispatch({ type: 'delete', data: { id: item.id } }),
        [item.id, dispatch],
    );

    const handleToggleDone = useCallback(
        () =>
            dispatch({
                type: 'toggleDone',
                data: { id: item.id },
            }),
        [item.id, dispatch],
    );

    const [isModalAddTag, setModalAddTag] = useState(false);
    const handleOpenModalAddTag = () => setModalAddTag(true);
    const handleCloseModalAddTag = () => setModalAddTag(false);

    const [isModalEditTodo, setModalEditTodo] = useState(false);
    const handleOpenModalEditTodo = () => setModalEditTodo(true);
    const handleCloseModalEditTodo = () => setModalEditTodo(false);

    return (
        <>
            {isModalAddTag && (
                <ModalAddTag
                    id={item.id}
                    open={isModalAddTag}
                    handleClose={handleCloseModalAddTag}
                />
            )}
            {isModalEditTodo && (
                <ModalEditTodo
                    item={item}
                    open={isModalEditTodo}
                    handleClose={handleCloseModalEditTodo}
                />
            )}
            <Card
                className={classnames(classes.root, {
                    [classes.doneRoot]: item.done,
                })}
            >
                <CardHeader
                    action={
                        <ButtonGroup variant="text" size="small" aria-label="small button group">
                            <IconButton aria-label="edit" onClick={handleOpenModalEditTodo}>
                                <EditIcon />
                            </IconButton>
                            <IconButton aria-label="delete" onClick={handleDelete}>
                                <DeleteIcon />
                            </IconButton>
                        </ButtonGroup>
                    }
                    title={
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={item.done}
                                    onChange={handleToggleDone}
                                    name={`checked-${item.id}`}
                                    color="primary"
                                />
                            }
                            label={item.title}
                        />
                    }
                />
                {item.details ? (
                    <CardContent className={classes.content}>
                        <Typography variant="body2" component="p">
                            {item.details}
                        </Typography>
                        {item.tag !== undefined ? (
                            <Chip label={item.tag.title} variant="outlined" />
                        ) : (
                            <Button onClick={handleOpenModalAddTag}>Add tag</Button>
                        )}
                    </CardContent>
                ) : null}
            </Card>
        </>
    );
};
