import React, { useState } from 'react';
import "./Page1.css";
import { useNavigate } from 'react-router-dom';
import ReadTask from './Resource/ReadTask';

export default function Page1() {
  const navigate = useNavigate();
  const [showReadTask, setShowReadTask] = useState(false);

  const handleCreate = () => {
    navigate('/page2');
  };

  const toggleReadTask = () => {
    setShowReadTask(!showReadTask);
  };

  return (
    <>
      <nav className="navbar bg-light d-flex justify-content-between" id="id-1">
        <div className="navbar-brand ms-4">Project Management Application</div>
        <ul className="navbar-nav d-flex flex-row justify-content-between px-2">
          <div className="d-flex gap-4 me-4">
            <li className="nav-item my-auto">User</li>
            <li className="nav-item my-auto">
              <img
                src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                alt="User"
                style={{ width: "32px", height: "32px", borderRadius: "50%" }}
              />
            </li>
          </div>
        </ul>
      </nav>

      <div className="d-flex">
        {/* Sidebar */}
        <div id="id-3" className="border-end">
          <button className="btn w-100 mb-2 text-start" id="id-5">Dashboard</button>
          <button className="btn w-100 mb-2 text-start" id="id-7">Project</button>
          <button className="btn w-100 mb-2 text-start btn-primary text-white" id="id-9">My Work</button>
        </div>

        {/* Main content */}
        <div className="flex-grow-1 p-3">
          <ul className="nav" id="id-D">
            <li className="nav-item">
              <a className="nav-link active" href="#">Task</a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="#">Issue</a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="#">Kanban Board</a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="#">Backlog</a>
            </li>
          </ul>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <button className="btn btn-primary" id="id-F" onClick={handleCreate}>New Task</button>
            <input className="form-control" placeholder="Search" id="id-H" />
          </div>


          <button className="btn dropdown-toggle mb-3" type="button" onClick={toggleReadTask}>
            Tasks
          </button>

          {showReadTask && (
            <div className="border border-2 p-3" style={{ height: 'calc(80vh - 100px)', overflowY: 'auto' }}>
              <ReadTask />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
