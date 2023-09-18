import {useState, useEffect} from 'react'
import useAxios from '../utils/useAxios'
import jwtDecode from 'jwt-decode'
import Swal from 'sweetalert2'


function Todo() {
    const baseUrl = "http://127.0.0.1:8000/api"
    const api = useAxios()

    const token = localStorage.getItem("authTokens") // 233704237huhweioyop;yrwriweyrwe
    const decoded = jwtDecode(token)
    const user_id = decoded.user_id

    const [todo, setTodo] = useState([])
    useEffect(() => {
        fetchTodos()
    }, [])

    const fetchTodos = async () => {
        await api.get(baseUrl + '/todo/' + user_id + '/').then((res) => {
            console.log(res.data);
            setTodo(res.data)
        })
    }

    
    const [createTodo, setCreateTodo] = useState({title: "", completed: ""})
    const handleNewTodoTitle = (event) => {
        setCreateTodo({
            ...createTodo,
            [event.target.name]: event.target.value
        })
    }
    
    console.log(createTodo.title);  

    const formSubmit = () => {
        const formdata = new FormData()

        formdata.append("user", user_id)
        formdata.append("title", createTodo.title)
        formdata.append("completed", false)

        try{
            api.post(baseUrl + '/todo/' + user_id + '/', formdata).then((res) => {
                console.log(res.data);
                Swal.fire({
                    title: "Todo Added",
                    icon:"success",
                    toast: true,
                    timer: 2000,
                    position: "top-right",
                    timerProgressBar: true,
                })
                fetchTodos()
                createTodo.title = ""
            })
        } catch (error){
            console.log(error);
        }
    }

    const deleteTodo = async (todo_id) => {
        await api.delete(baseUrl + '/todo-detail/' + user_id + '/' + todo_id + '/')
        Swal.fire({
            title: "Todo Deleted",
            icon:"success",
            toast: true,
            timer: 2000,
            position: "top-right",
            timerProgressBar: true,
        })
        fetchTodos()
    }

    const markTodoAsComplete = async (todo_id) => {
        await api.patch(baseUrl + '/todo-mark-as-completed/' + user_id + '/' + todo_id + '/')
        Swal.fire({
            title: "Todo Completed",
            icon:"success",
            toast: true,
            timer: 2000,
            position: "top-right",
            timerProgressBar: true,
        })
        fetchTodos()
    }

  return (
        <div>
            <div>
                <div className="container" style={{marginTop:"150px", padding:"10px"}}>
                    <div className="row justify-content-center align-items-center main-row">
                        <div className="col shadow main-col bg-white">
                            <div className="row bg-primary text-white">
                                <div className="col p-2">
                                    <h4>Desphixs Todo App</h4>
                                </div>
                            </div>
                            <div className="row justify-content-between text-white p-2">
                                <div className="form-group flex-fill mb-2">
                                    <input id="todo-input" name='title' onChange={handleNewTodoTitle} value={createTodo.title} type="text" className="form-control" placeholder='Write a todo...'  />
                                </div>
                                <button type="button" onClick={formSubmit}  className="btn btn-primary mb-2 ml-2"> Add todo </button>
                            </div>
                            <div className="row" id="todo-container">
                                {todo.map((todo) => 
                                
                                <div className="col col-12 p-2 todo-item">
                                    <div className="input-group">
                                        {todo.completed.toString() === "true" && 
                                            <p className="form-control"><strike>{todo.title}</strike></p>
                                        }
                                        {todo.completed.toString() === "false" && 
                                            <p className="form-control">{todo.title}</p>
                                        }
                                        <div className="input-group-append">
                                            <button className="btn bg-success text-white ml-2" type="button" id="button-addon2 " onClick={() => markTodoAsComplete(todo.id)}><i className='fas fa-check' ></i></button>
                                            <button className="btn bg-danger text-white me-2 ms-2 ml-2" type="button" id="button-addon2 " onClick={() => deleteTodo(todo.id)}><i className='fas fa-trash' ></i></button>
                                        </div>
                                    </div>
                                </div>
                                )}
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default Todo