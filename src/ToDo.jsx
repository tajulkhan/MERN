import React, { useState, useEffect } from "react";

export default function ToDo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);
  const apiUrl = "http://localhost:8000";

  //Edite state
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const handleSubmit = () => {
    setError("");
    // add item list
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            setTodos([...todos, { title, description }]);
            setTitle("");
            setDescription("");
            setTimeout(() => {
              setMessage("Item updated successfully");
            }, 3000);
          } else {
            setError("Unable to create ToDo item");
          }
        })
        .catch(() => {
          setError("Unable to create ToDo item");
        });
    }
  };
  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
    console.log(editId);
  };
  const handleUpdate = () => {
    setError("");
    // update item list
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(apiUrl + "/todos/" + editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      })
        .then((res) => {
          if (res.ok) {
            const updatedTodos = todos.map((item) => {
              if (item._id == editId) {
                item.title = editTitle;
                item.description = editDescription;
              }
              return item;
            });

            setTodos(updatedTodos);
            setTimeout(() => {
              setMessage("Item updated successfully");
            }, 3000);
            setEditId(-1);
          } else {
            setError("Unable to create ToDo item");
          }
        })
        .catch(() => {
          setError("Unable to create ToDo item");
        });
    }
  };
  const handelCancel = () => {
    setEditId(-1);
  };
  const handleDelete = (id) => {
    if (window.confirm("Are you sure want to delete?")) {
      fetch(apiUrl + "/todos/" + id, {
        method: "DELETE",
      }).then((id) => {
        const updatedTodos = todos.filter((item) => item._id !== id);
        setTodos(updatedTodos);
        getItems();
      });
    }
  };
  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((res) => {
        setTodos(res);
      });
  };
  useEffect(() => {
    getItems();
    console.log(todos);
  }, []);
  return (
    <>
      <div className="row p-3 mt-3 mb-3 bg-success text-light">
        <h4>Today's Task Plan: Focused Action for Productive Progress</h4>
        {/* <h1>ToDo ------</h1> */}
      </div>
      <div className="row">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-2">
          <input
            placeholder="Title"
            type="text"
            className="form-control"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <input
            placeholder="Description"
            type="text"
            className="form-control"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>
      <div className="row">
        <h3 className="mt-2">Tasks</h3>
        <ul className="list-group mt-3">
          {todos.map((item) => {
            return (
              <li
                key={item._id}
                className="list-group-item my-2 bg-light d-flex justify-content-between align-items-center"
              >
                <div className="d-flex flex-column">
                  {editId === -1 || editId !== item._id ? (
                    <>
                      <span className="fw-bold">{item.title}</span>
                      <span>{item.description}</span>
                    </>
                  ) : (
                    <>
                      <div className="form-group d-flex gap-2">
                        <input
                          placeholder="Title"
                          type="text"
                          className="form-control"
                          onChange={(e) => setEditTitle(e.target.value)}
                          value={editTitle}
                        />
                        <input
                          placeholder="Description"
                          type="text"
                          className="form-control"
                          onChange={(e) => setEditDescription(e.target.value)}
                          value={editDescription}
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="d-flex gap-2">
                  {editId === -1 || editId !== item._id ? (
                    <>
                      <button
                        className="btn btn-warning"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-success"
                        onClick={handleUpdate}
                      >
                        Update
                      </button>
                      <button className="btn btn-dark" onClick={handelCancel}>
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
