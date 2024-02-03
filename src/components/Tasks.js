import React, { useEffect, useState, useContext } from "react";
import { db, auth } from "./config/FirebaseConfig"; // Import auth from FirebaseConfig
import { getDocs, collection, addDoc, updateDoc, doc, deleteDoc, query, where } from "firebase/firestore";
import deletes from "../images/icon-cross.svg"
import check from "../images/square-svgrepo-com.svg"
import checked from "../images/icon-check.svg"
import { context } from "./ThemeContext";
import { Widthcontext } from "./WidthContext";
import Notification from "./Notification";
function Tasks() {
    const [status, setStatus] = useState("All");
    const { theme, setTheme } = useContext(context);
    const { windowWidth } = useContext(Widthcontext);
    console.log(windowWidth);
    const tasksCollection = collection(db, "Tasks");
    const [taskCollection, setTaskCollection] = useState([]);
    const [addtask, setAddTask] = useState("");
    const [user, setUser] = useState(false);
    const [input,setInput]=useState(false)
    const [showNotification, setShowNotification] = useState(false); // New state variable

    const getTasks = async () => {
        if (!auth?.currentUser) {
            setUser(false);
            setTaskCollection([]); // Clear task collection if user is not logged in
            console.log(user);
            return;
        }
        else if (auth?.currentUser){
            try {
                const data = await getDocs(query(collection(db, 'Tasks'), where('userId', '==', auth.currentUser.uid)));

                let filteredData = [];
    
                if (status === "All") {
                    filteredData = data.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id
                    }));
                } else if (status === "Active") {
                    filteredData = data.docs.filter((doc) => !doc.data().completed)
                        .map((doc) => ({
                            ...doc.data(),
                            id: doc.id
                        }));
                } else if (status === "Completed") {
                    filteredData = data.docs.filter((doc) => doc.data().completed)
                        .map((doc) => ({
                            ...doc.data(),
                            id: doc.id
                        }));
                }
    
                setTaskCollection(filteredData);
            } catch (error) {
                // Handle the error gracefully, for example:
                console.error("Error fetching tasks:", error);
                // Clear task collection or perform other appropriate actions
                setTaskCollection([]);
            }
        }
    }
    
    useEffect(()=>{
        getTasks()
    },[status])

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(true);
                // Only fetch tasks if the user is logged in
                getTasks();
            } else {
                setUser(false);
                // Clear task collection if user is not logged in
                setTaskCollection([]);
            }
        });
    
        // Clean up the subscription when the component unmounts
        return () => unsubscribe();
    }, []);
    
    useEffect(() => {
        if (showNotification) {
            const timer = setTimeout(() => {
                setShowNotification(false); // Reset showNotification state after 3000 milliseconds (3 seconds)
            }, 3000);
            
            return () => clearTimeout(timer); // Cleanup function to clear the timer
        }
    }, [showNotification]);

    function handleAll() {
        setStatus("All");
        getTasks();
    }

    function handleActive() {
        setStatus("Active");
        getTasks();
    }

    function handlecomplete() {
        setStatus("Completed");
        getTasks();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (addtask.trim() !== "") {
            try {
                await addDoc(tasksCollection, { Name: addtask, completed: false, userId: auth?.currentUser?.uid });
                setAddTask("");
                getTasks();
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        } else {
            setInput(true);
            setShowNotification(true); // Show notification when input is empty
        }
    };

    const handleCompleted = async (id) => {
        try {
            const currentTask = doc(db, "Tasks", id);
            await updateDoc(currentTask, { completed: !taskCollection.find(task => task.id === id).completed });
            getTasks();
            
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    const deleteTask = async (id) => {
        try {
            const currentTask = doc(db, "Tasks", id);
            await deleteDoc(currentTask);
            getTasks();
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    const style = {
        backgroundColor: theme ? 'hsl(0, 0%, 98%)' : 'hsl(235, 24%, 19%)',
        color: theme ? 'hsl(235, 19%, 35%)' : 'hsl(234, 39%, 85%)'
    };

    const style1 = {
        backgroundColor: theme ? 'hsl(236, 33%, 92%)' : 'hsl(235, 21%, 11%)'
    };

    const [isHovered, setIsHovered] = useState(false);

    const style3 = {
        display: isHovered ? 'table-cell' : 'none'
    };

    return (
        <>
        {showNotification && <Notification/>}
        
        <div className="main-main" style={style1}>
            
            <div className="main" >
                <form onSubmit={handleSubmit}>
                    <input
                        style={{ ...style, border: "0" }}
                        className="task"
                        placeholder="Create a new todo..."
                        value={addtask}
                        onChange={(e) => setAddTask(e.target.value)}
                    />
                    <input style={style} className="butt" type="submit" value="Add Task"/>
                </form>
                <table style={{ ...style, cursor: 'pointer' }}>
                    <tbody>
                        {taskCollection.map((item) => (
                            <tr key={item.id} className="ta" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                                <td style={{ width: '33%'}}>
                                    <div style={{}}>
                                        <img
                                            style={{
                                                backgroundImage: item.completed ?
                                                    "linear-gradient(to right, hsl(192, 100%, 67%), hsl(280, 87%, 65%))" :
                                                    "none",
                                                width: item.completed ? '5% !important' : '20px',
                                                borderRadius: item.completed && '100%',
                                                padding: item.completed && '5px',
                                                cursor: 'pointer'
                                            }}
                                            src={item.completed ? checked : check}
                                            onClick={() => handleCompleted(item.id)}
                                        />
                                    </div>
                                </td>
                                <td style={{ width: '53%' }}>
                                    <h4 style={{ color: item.completed && 'hsl(236, 9%, 61%)', textDecoration: item.completed && 'line-through' ,textAlign:"left"}} className="table">{item.Name}</h4>
                                </td>
                                <td style={{ width: '33%', cursor: 'pointer' }}>
                                    <img style={style3} src={deletes} onClick={() => deleteTask(item.id)} className="del" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div> 
                    <h3></h3>
                </div>
                {taskCollection.filter((item) => item.Name).length===0 &&
                    <div style={style} className="left">
                        <p> Add tasks...</p>
                    </div>
                    }
                <div className="filter" style={style}>
                <div style={style} >
                        <p>{taskCollection.filter((item) => !item.completed).length} items left</p>
                    </div>
                    <div style={{ display: "inline-flex", gap: '10px' }} >
                        <p style={{ color: status === "All" && 'hsl(220, 98%, 61%)', cursor: 'pointer' }} onClick={handleAll}>All</p>
                        <p style={{ color: status === "Active" && 'hsl(220, 98%, 61%)', cursor: 'pointer' }} onClick={handleActive}>Active</p>
                        <p style={{ color: status === "Completed" && 'hsl(220, 98%, 61%)', cursor: 'pointer' }} onClick={handlecomplete}>Completed</p>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default Tasks;
