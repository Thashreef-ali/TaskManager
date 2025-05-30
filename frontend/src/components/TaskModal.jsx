import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import {AlignLeft, Calendar, CheckCircle, Flag, PlusCircle, Save, X} from 'lucide-react'
import { useCallback } from 'react';


const API_BASE = 'https://taskmanager-backend-v5cr.onrender.com/api'

function TaskModal({isOpen,onClose,taskEdit,onSave,onLogout}) {
  const DEFAULT_TASK = {
    title: "",
    description: "",
    priority: "LOW",
    dueDate: "",
    completed: "No",
    id: null,
};
  const [taskData,settaskData] = useState(DEFAULT_TASK)
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState(null)
  const today = new Date().toISOString().split('T')[0]
useEffect(()=>{
  if(!isOpen)return;
  if(taskEdit){
    const normalized = taskEdit.completed === 'Yes' || taskEdit.completed === true ? 'Yes' :'No'
    settaskData({
      ...DEFAULT_TASK,
      title:taskEdit.title || '',
      description:taskEdit.description || '',
      priority:taskEdit.priority || 'Low',
      dueDate:taskEdit.dueDate?.split('T')[0] || '',
      completed:normalized,
      id:taskEdit._id

    })
  }
   else{
    settaskData(DEFAULT_TASK)
   }
   setError(null)
},[isOpen,taskEdit])
const handleChange =useCallback((e)=>{
  const {name,value} = e.target;
  settaskData(prev => ({...prev,[name]:value}))
},[])
const getHeaders = useCallback(()=>{
  const token = localStorage.getItem('token')
  if(!token) throw new Error('No auth token found')
    return{
      'Content-Type' : "application/json",
      Authorization: `Bearer ${token}`
  }
},[])
const handleSubmit = useCallback(async(e)=>{
  e.preventDefault()
  if(taskData.dueDate < today ){
    setError('Due date cannot be in the past')
    return;
  }
  setLoading(true)
  setError(null)
  try {
    const  isEdit = Boolean(taskData.id)
    const url = isEdit ? `${API_BASE}/${taskData.id}/gp` : `${API_BASE}/gp`
    const resp = await fetch(url,{
      method:isEdit? 'PUT' : 'POST',
      headers:getHeaders(),
      body:JSON.stringify(taskData)
    })
    if(!resp.ok){
      if(resp.status === 401) return onLogout?.();
      const err = await resp.json();
      throw new Error(err.message || 'Failed to save tasks')
    }
    const saved = await resp.json();
    onSave?.(saved);
    onClose()
  } catch (error) {
    setError(error.message || 'an error occured')
  }
  finally{
    setLoading(false)
  }
},[taskData,today,getHeaders,onLogout,onSave,onClose])
const priorityStyles = {
    LOW: "bg-green-100 text-green-700 border-green-200",
    MEDIUM: "bg-purple-100 text-purple-700 border-purple-200",
    HIGH: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
};
if(!isOpen) return null;
  return (
    <div className='inset-0 fixed backdrop-blur-sm bg-black/20 z-50 flex items-center justify-center p-4'>
      <div className='bg-white border border-purple-100 rounded-xl max-w-md w-full 
      shadow-lg relative p-6 animate-fadeIn'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-gray-800 flex items-center gap-2'>
            {taskData.id ? <Save className='w-5 h-5 text-purple-500'/>:
            <PlusCircle className='w-5 h-5 text-purple-500'/>}
            {taskData.id? 'Edit Task' : 'Create New Task'}
          </h2>
        <button onClick={onClose} className=' p-2  hover:bg-purple-500  rounded-lg
        transition-colors text-gray-500 hover:text-purple-700'>
          <X className='w-5 h-5'/>
        </button>
        </div>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {error && <div className=' text-sm text-red-600 bg-red-50 p-3 rounded-lg 
          border border-red-100'>{error}</div>}
          <div className=''>
            <label className=' block text-sm font-medium text-gray-700 mb-1'>
              Task Title
            </label>
            <div className=' flex items-center border border-purple-100 rounded-lg px-3 py-2.5
            focus-within:ring-2 focus-within:ring-purple-500  focus-within:border-purple-500 
            transition-all duration-200'>
              <input type="text" name='title' required value={taskData.title}
              onChange={handleChange} className=' w-full focus:outline-none text-sm'
              placeholder='Enter task title'/>

            </div>
          </div>
          <div>
            <label className=' flex items-center gap-1 text-sm font-medium text-gray-700 mb-1'>
              <AlignLeft className=' w-4 h-4 text-purple-500 '/> Description
            </label>
            <textarea name="description" rows='3' 
            onChange={handleChange} value={taskData.description} className="w-full px-4 py-2.5 border border-purple-100 rounded-lg focus:ring-2 focus:ring-purple-500
             focus:border-purple-500 text-sm" placeholder='add details about your task'/>
          </div>
          <div className=' grid grid-cols-2 gap-4'>
              <div>
                <label className=' flex items-center gap-1 text-sm font-medium text-gray-700 mb-1'>
              <Flag className=' w-4 h-4 text-purple-500 '/> Priority
            </label>
            <select name="priority" value={taskData.priority} onChange={handleChange}
            className={`w-full px-4 py-2.5 border border-purple-100 rounded-lg focus:ring-2 focus:ring-purple-500
             focus:border-purple-500 text-sm ${priorityStyles[taskData.priority]}`}>
              <option value='LOW'>Low</option>
              <option value='MEDIUM'>Medium</option>
              <option value='HIGH'>High</option>

             </select>
              </div>

              <div>
                  <label className=' flex items-center gap-1 text-sm font-medium text-gray-700 mb-1'>
                      <Calendar className=' w-4 h-4 text-purple-500 '/> Due Date
                  </label>
                  <input type="date" name="dueDate" required min={today} value={taskData.dueDate}
                  onChange={handleChange} className="w-full px-4 py-2.5 border border-purple-100 rounded-lg focus:ring-2 focus:ring-purple-500
                   focus:border-purple-500 text-sm"/>
              </div>
          </div>

          <div>
            <label className=' flex items-center gap-1 text-sm font-medium text-gray-700 mb-2'>
                      <CheckCircle className=' w-4 h-4 text-purple-500 '/> Status
            </label>
            <div className=' flex gap-4 '>
               {[{val:'Yes',label:"Completed"},
                {val:'No',label:'In Progress'}
               ].map(({val,label})=>(
                <label key={val} className=' flex items-center'>
                  <input type='radio' name='completed' value={val} checked={taskData.completed === val}
                onChange={handleChange} className='w-4 h-4 text-purple-600 focus:ring-purple-500
                border-gray-300 rounded'/>
                <span className='ml-2 text-sm text-gray-700'>{label}</span>
                </label>
             
               ))}
            </div>
          </div>
          <button type='submit' disabled={loading} 
          className='w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white
          font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50
          hover:shadow-md transition-all duration-200'>
           {loading ? 'Saving...' : (taskData.id ? <>
           <Save className='w-5 h-5'/> Update Task
           </>:<>
           <PlusCircle className='w-4 h-4'/> Create Task
           </>)}
          </button>
        </form>
      </div>
    </div>
  )
}

export default TaskModal