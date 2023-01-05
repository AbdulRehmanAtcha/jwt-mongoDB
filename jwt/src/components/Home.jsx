import { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import { useContext } from "react";
import { GlobalContext } from '../context/Context'

let baseURL = "";
if (window.location.href.split(":")[0] === "http") {
    baseURL = `http://localhost:5001`;
}
else {
    baseURL = `https://spring-bud-pike-coat.cyclic.app`;
}

function Home() {
    axios.defaults.withCredentials = true
    let { state, dispatch } = useContext(GlobalContext);
    const [products, setProducts] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [editId, setEditId] = useState(null);
    const [showEdit, setShowEdit] = useState(false);
    const [editName, setEditName] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editDesc, setEditDesc] = useState("");
    const [loading, setLoading] = useState(false);

    const addObj = {
        name: name,
        price: price,
        description: description
    }


    const showAddBox = (e) => {
        e.preventDefault();
        setShowAdd(true);
    }


    const hideAddBox = (e) => {
        e.preventDefault();
        setShowAdd(false);
        console.log(name);
        console.log(price);
        console.log(description);
        setLoading(true);
        axios.post(`${baseURL}/api/v1/product`, addObj)


            .then(response => {
                setLoading(false)
                console.log("response: ", response.data);
                allPosts();

            })
            .catch(err => {
                setLoading(false)
                console.log("error: ", err);
            })
    }



    const allPosts = async () => {
        setLoading(true)

        try {
            setLoading(false)

            const response = await axios.get(`${baseURL}/api/v1/products`)
            console.log("Got All Products", response.data.data);
            setProducts(response.data.data);
        }

        catch (error) {
            setLoading(false)
            console.log("Error", error);
        }
    }


    useEffect(() => {
        allPosts();
        // console.log(state.user)  
    }, [])

    const deletProduct = async (id) => {
        setLoading(true)

        try {
            // setLoading(false)
            const response = await axios.delete(`${baseURL}/api/v1/product/${id}`)
            console.log("Got All Products", response.data.data);
            allPosts();
        }

        catch (error) {
            // setLoading(false)
            console.log("Error", error);
        }
    }

    const editHandler = async (e) => {
        setShowEdit(true);
    }


    const updateHandler = (event) => {

        event.preventDefault();
        setShowEdit(false);
        let newName = editName;
        let newPrice = editPrice;
        let newDesc = editDesc;
        setLoading(true)
        axios.put(`${baseURL}/api/v1/product/${editId}`, {
            name: newName,
            price: newPrice,
            description: newDesc,
        })
            .then((response) => {
                // setLoading(false)

                console.log(response);
                allPosts();

            }, (error) => {
                // setLoading(false)

                console.log(error);
            });
    }
    const editNameHandler = (e) => {
        setEditName(e.target.value);
    }

    const editPriceHandler = (e) => {
        setEditPrice(e.target.value);
    }
    const editDescHandler = (e) => {
        setEditDesc(e.target.value);
    }

    const logoutHandler = async () => {
        try {
            let response = await axios.post(`${baseURL}/api/v1/logout`,
                {
                    withCredentials: true
                })
            console.log("res", response);
            dispatch({
                type: 'USER_LOGOUT'
            })
        }
        catch (e) {
            console.log("e: ", e);
        }
    }


    return (
        <>
            {
                (loading === true)
                    ?
                    <div className="spinner-grow text-secondary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    :
                    <div className='main-box'>
                        <div className="nav fixed-top">
                            <p>Product Managing</p>
                            <div className="add-button">
                                <button className='user'>{(state?.user?.user?.firstName === undefined)? state.user.email : state?.user?.user?.firstName + " "+ state?.user?.user?.lastName}</button>
                                <form onSubmit={showAddBox}>
                                    <button type="submit button" className="btn btn-success">Add Product</button>
                                </form>
                                <button type="submit button" onClick={logoutHandler} className="btn btn-danger">Logout</button>
                            </div>
                        </div>
                        <div className="add-form">
                            <div className={showAdd ? "box show-add" : "box hide-add"}>
                                <form onSubmit={hideAddBox}>
                                    <input type="text" placeholder='Name Of Product.' required minLength="3" onChange={(e) => {
                                        setName(e.target.value)
                                    }} />
                                    <input type="number" placeholder='Enter Product Price' required onChange={(e) => {
                                        setPrice(e.target.value);
                                    }} />
                                    <textarea cols="50" rows="8" placeholder='Enter Product Description.' required minLength="3" maxLength="100" onChange={(e) => {
                                        setDescription(e.target.value);
                                    }} ></textarea>
                                    <button type='submit'>ADD</button>
                                </form>
                            </div>
                            <div className="edit-box">
                                <div className={showEdit ? "editshow" : "edithide"} id="edit">
                                    <form onSubmit={updateHandler}>
                                    <input type="text" onChange={editNameHandler} placeholder="New Name" />

                                    <input type="number" placeholder="New Price" onChange={editPriceHandler} />

                                    <textarea cols="50" rows="6" onChange={editDescHandler}></textarea>
                                    <button type='submit'>Update</button>
                                </form>
                                </div>
                            </div>
                        </div>

                        <table className="table table-dark table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Product ID</th>
                                    <th scope="col">Product Name</th>
                                    <th scope="col">Product Price</th>
                                    <th scope="col">Product Description</th>
                                    <th scope="col">Edit Choice</th>
                                    <th scope="col">Delete Choice</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((eachProduct, i) => (
                                    <tr key={i}>
                                        <th scope="row">{eachProduct._id}</th>
                                        <td>{eachProduct.name}</td>
                                        <td>{eachProduct.price}</td>
                                        <td>{eachProduct.description}</td>
                                        <td><button className="btn btn-primary" onClick={() => {
                                            editHandler(
                                                setEditId(eachProduct._id)
                                            )

                                        }}>Edit</button></td>
                                        <td><button className="btn btn-danger" onClick={() => {
                                            deletProduct(eachProduct._id)
                                        }}>DELETE</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
            }

        </>
    );
}

export default Home;

