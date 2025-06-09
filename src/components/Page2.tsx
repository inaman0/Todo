import React from 'react';
import "./Page2.css";
import { useNavigate } from 'react-router-dom';
import CreateTask from './Resource/CreateTask';

export default function Page2() {
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar bg-light d-flex justify-content-between" id="id-N">
        <div className="navbar-brand ms-4">Project Management Application</div>
        <ul className="navbar-nav d-flex flex-row justify-content-between px-2">
          <div className="d-flex gap-4 me-4">
            <li className="nav-item my-auto">user</li>
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
        <div id="id-P">
          <button className="btn w-100 mb-2 text-start" id="id-R">Dashboard</button>
          <button className="btn w-100 mb-2 text-start" id="id-T">Project</button>
          <button className="btn w-100 mb-2 text-start btn-primary text-white" id="id-V">My Work</button>
        </div>

        {/* Main content */}
        <div id="id-X" className="flex-grow-1">
          <ul className="nav" id="id-Z">
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

          <div className="d-flex mb-3 justify-content-end" style={{ gap: '1rem' }}>
            <button className="btn btn-primary" id="id-11">Create Subtask</button>
            <button className="btn btn-primary" id="id-13">Link Issue</button>
          </div>

          <div className="d-flex border border-2 h-70" id="id-15">
            <CreateTask />
          </div>
        </div>
      </div>
    </>
  );
}
