import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useReducer,
} from 'react';


export interface Tag {
    id: string;
    title: string;
}
export interface TodoItem {
    id: string;
    title: string;
    details?: string;
    done: boolean;
    tag: Tag;
}

interface TodoItemsState {
    todoItems: TodoItem[];
    filteredTodoItems: TodoItem[];
}

interface TodoItemsAction {
    type: 'loadState' | 'add' | 'delete'
    | 'toggleDone' | 'filterByTag' | 'resetFilter' | 'addTag';
    data: any;
}

const TodoItemsContext = createContext<
    (TodoItemsState & { dispatch: (action: TodoItemsAction) => void }) | null
>(null);

const defaultState = {
    todoItems: [],
    filteredTodoItems: []
};
const localStorageKey = 'todoListState';

export const TodoItemsContextProvider = ({
    children,
}: {
    children?: ReactNode;
}) => {
    const [state, dispatch] = useReducer(todoItemsReducer, defaultState);

    useEffect(() => {
        const savedState = localStorage.getItem(localStorageKey);

        if (savedState) {
            try {
                dispatch({ type: 'loadState', data: JSON.parse(savedState) });
            } catch { }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(localStorageKey, JSON.stringify(state));
    }, [state]);

    return (
        <TodoItemsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </TodoItemsContext.Provider>
    );
};

export const useTodoItems = () => {
    const todoItemsContext = useContext(TodoItemsContext);

    if (!todoItemsContext) {
        throw new Error(
            'useTodoItems hook should only be used inside TodoItemsContextProvider',
        );
    }

    return todoItemsContext;
};

function todoItemsReducer(state: TodoItemsState, action: TodoItemsAction) {
    switch (action.type) {
        case 'loadState': {
            return action.data;
        }
        case 'add':
            return {
                ...state,
                todoItems: [
                    { id: generateId(), done: false, ...action.data.todoItem },
                    ...state.todoItems,
                ],
            };
        case 'delete':
            return {
                ...state,
                todoItems: state.todoItems.filter(
                    ({ id }) => id !== action.data.id,
                ),
            };
        case 'toggleDone':
            const itemIndex = state.todoItems.findIndex(
                ({ id }) => id === action.data.id,
            );
            const item = state.todoItems[itemIndex];

            return {
                ...state,
                todoItems: [
                    ...state.todoItems.slice(0, itemIndex),
                    { ...item, done: !item.done },
                    ...state.todoItems.slice(itemIndex + 1),
                ],
            };
        case 'filterByTag':
            return {
                ...state,
                filteredTodoItems: state.todoItems.filter(({ tag }) => (
                    tag && tag.title.toLowerCase() === action.data.tag?.toLowerCase()
                ))
            }
        case 'resetFilter':
            return {
                ...state,
                filteredTodoItems: []
            }
        case 'addTag':
            return {
                ...state,
                todoItems: state.todoItems.map(todo => {
                    if (todo.id === action.data.todoId) {
                        return {
                            ...todo,
                            tag: {
                                ...todo.tag,
                                title: action.data.tag
                            }
                        }
                    }
                    return todo;
                })
            }
        default:
            throw new Error();
    }
}

function generateId() {
    return `${Date.now().toString(36)}-${Math.floor(
        Math.random() * 1e16,
    ).toString(36)}`;
}
