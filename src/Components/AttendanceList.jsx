// AttendanceList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseUrl from "../api";
import './AttendanceList.css'; // Import external CSS file

const AttendanceList = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [newRecord, setNewRecord] = useState({ Name: '', status: 'Present' });
    const [editRecordId, setEditRecordId] = useState(null); // Track the ID of the record being edited

    useEffect(() => {
        fetchAttendanceRecords();
    }, []);

    const fetchAttendanceRecords = () => {
        axios.get(`${baseUrl}/`)
            .then(response => {
                // console.log(response);
                setAttendanceRecords(response.data);
            })
            .catch(error => {
                console.error('Error fetching attendance records:', error);
            });
    };

    const addAttendanceRecord = () => {
        if (editRecordId) {
            // If editing, update the record
            axios.put(`${baseUrl}/${editRecordId}`, newRecord)
                .then(response => {
                    fetchAttendanceRecords();
                    setNewRecord({ Name: '', status: 'Present' });
                    setEditRecordId(null);
                })
                .catch(error => {
                    console.error('Error updating attendance record:', error);
                });
        } else {
            // If not editing, add a new record
            axios.post(`${baseUrl}/`, newRecord)
                .then(response => {
                    fetchAttendanceRecords();
                    setNewRecord({ Name: '', status: 'Present' });
                })
                .catch(error => {
                    console.error('Error adding attendance record:', error);
                });
        }
    };

    const deleteAttendanceRecord = (recordId) => {
        axios.delete(`${baseUrl}/${recordId}`)
            .then(response => {
                // console.log(response);
                fetchAttendanceRecords();
            })
            .catch(error => {
                console.error('Error deleting attendance record:', error);
            });
    };

    const editAttendanceRecord = (recordId) => {
        // Find the record to edit
        const recordToEdit = attendanceRecords.find(record => record._id === recordId);
        if (recordToEdit) {
            setNewRecord({ Name: recordToEdit.Name, status: recordToEdit.status });
            setEditRecordId(recordId);
        }
    };

    const handleChange = (e) => {
        setNewRecord({ ...newRecord, [e.target.name]: e.target.value });
    };

    return (
        <div className="attendance-container">
            <div className="attendance-box">
                <h2 className="attendance-title">Attendance Records</h2>
                <div className="attendance-form">
                    <input
                        type="text"
                        name="Name"
                        placeholder="Student Name"
                        value={newRecord.Name}
                        onChange={handleChange}
                    />
                    <select name="status" value={newRecord.status} onChange={handleChange}>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                    </select>
                    <button onClick={addAttendanceRecord}>
                        {editRecordId ? 'Update Record' : 'Add Record'}
                    </button>
                </div>
                <table className="attendance-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceRecords.map(record => (
                            <tr key={record._id}>
                                <td>{record.Name}</td>
                                <td>{record.status}</td>
                                <td>
                                    <button className="edit-button" onClick={() => editAttendanceRecord(record._id)}>Edit</button>
                                    <button className="delete-button" onClick={() => deleteAttendanceRecord(record._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceList;
