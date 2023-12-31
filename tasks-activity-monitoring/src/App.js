import Menu from './Menu';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Tasks from './Tasks';
import About from './About';
import AllRecordings from './AllRecordings';
import Settings from './Settings';
import Summary from './Summary';


function App() {

    // Fetching theme to set the colors when app is launched
    useEffect(() => {
        const body = document.getElementsByTagName('body')[0];
        fetch('http://localhost:3010/settings')
            .then(response => response.json())
            .then(data => {
                body.style.backgroundColor = (data.theme === 'dark') ? '#354657' : 'whitesmoke';
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);


    return (
        <BrowserRouter>
            <Menu />
            <Routes>
                <Route path='/' element={null} />
                <Route path='/about' element={<About />} />
                <Route path='/tasks' element={<AllRecordings />} />
                <Route path='/summary' element={<Summary />} />
                <Route path='/settings' element={<Settings />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
