import { useState, useEffect } from 'react';
import TasksItem from './TasksItem';
import { v4 as uuidv4 } from 'uuid';
import Form from './Form';



// This is recordings list view, made during whole time
function AllRecordings() {
    const [recordingsList, setRecordingList] = useState([]);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [uniqueTags, setUniqueTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [filterActive, setFilterActive] = useState(false);
    const [updateTags, setUpdateTags] = useState(false);
    const [render, setRender] = useState(false);
    const [taskList, setTaskList] = useState([]);
    const [task, setTask] = useState({ id: '', date: '', status: 'Inactive', task: '', tags: [], start: [], end: [], timeTotal: '00:00:00', observationStart: '', observationEnd: '' });





    useEffect(() => {
        const timer = setTimeout(() => {
            setRender(true);
        }, 200);

        return () => clearTimeout(timer);
    }, [render]);


    // Fetching all recordings from db.json
    useEffect(() => {
        fetch('/records')
            .then(response => response.json())
            .then(data => setRecordingList(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [showFilterDropdown, updateTags]);

    // Setting array of unique tags
    useEffect(() => {
        const tagsSet = new Set();
        recordingsList.forEach(item => {
            item.tags.forEach(tag => tagsSet.add(tag));
        });
        setUniqueTags(Array.from(tagsSet));
    }, [recordingsList]);


    const toggleTag = (tag) => {
        setSelectedTags(prevTags => (
            prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]));
    }

    const applyFilter = () => {
        setFilterActive(true);
        setShowFilterDropdown(false);
    }

    const newTagsFromTaskItem = () => {
        setUpdateTags(!updateTags);
    }

    const setItemStatus = (stat) => {
        setRender(stat);
    }

    const setNewTaskList = (list) => {
        setRecordingList(list);
    }

    const addTaskToApi = async () => {
        await fetch('/records', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        })
            .then(resp => resp.json())
            .then(data => {
                console.log(data);
            });
    }

    const recordTask = async (event) => {
        await event.preventDefault();
        if (task.task === '' || task.tags.length < 1) {
            return;
        } else {
            // timeDifference();
            setTaskList([...taskList, task]);
            addTaskToApi();
            setUpdateTags(!updateTags);
        }

        // Setting empty fields for start and end to make input fields empty after form submit
        setTask(prev => ({ ...prev, task: '', tags: [] }));
    }

    const inputChanged = (event) => {
        const date = (new Date()).toLocaleDateString('fi-FI', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
        let key = event.target.name;
        let value = event.target.value;
        setTask({ ...task, id: uuidv4(), date: date, observationStart: `${date}, 00:00:00`, observationEnd: 'Current time', [key]: (key === 'tags') ? [value] : value });
    }



    return !render ? null : (
        <div>
            <button className='filtering' onClick={() => setShowFilterDropdown(!showFilterDropdown)}>Filter by Tags &#9660;</button>
            {showFilterDropdown && (
                <div className='filter-dropdown'>
                    {uniqueTags.map(tag => (
                        <label id='filter_tag' key={tag}>
                            <input
                                name='checkbox'
                                type='checkbox'
                                checked={selectedTags.includes(tag)}
                                onChange={() => toggleTag(tag)}
                            />
                            {tag}
                        </label>
                    ))}
                    <button className='filtering' onClick={applyFilter}>Apply</button>
                </div>
            )}
            <button className='filtering' onClick={() => {
                setSelectedTags([]);
                setFilterActive(false);
            }}>Reset Filter</button><br />
            <Form task={task} inputChanged={inputChanged} recordTask={recordTask} />

            {filterActive ? (
                recordingsList.map((item, index) => (
                    selectedTags.every(tag => item.tags.includes(tag)) && (
                        <TasksItem
                            key={index}
                            id={item.id}
                            date={item.date}
                            status={item.status}
                            task={item.task}
                            tags={item.tags}
                            startTimes={item.start}
                            endTimes={item.end}
                            existingTags={uniqueTags}
                            uniqueTagsUpdate={newTagsFromTaskItem}
                            timeTotal={item.timeTotal}
                            setItemStatus={setItemStatus}
                            recordingsList={recordingsList}
                            setNewTaskList={setNewTaskList}
                            observationStart={item.observationStart}
                            observationEnd={item.observationEnd}
                        />
                    )
                ))
            ) : (
                recordingsList.map((item, index) => (
                    <TasksItem
                        key={index}
                        id={item.id}
                        date={item.date}
                        status={item.status}
                        task={item.task}
                        tags={item.tags}
                        startTimes={item.start}
                        endTimes={item.end}
                        existingTags={uniqueTags}
                        uniqueTagsUpdate={newTagsFromTaskItem}
                        timeTotal={item.timeTotal}
                        setItemStatus={setItemStatus}
                        recordingsList={recordingsList}
                        setNewTaskList={setNewTaskList}
                        observationStart={item.observationStart}
                        observationEnd={item.observationEnd}
                    />
                )
                )
            )
            }
        </div>
    );

}


export default AllRecordings;