import { ThemessProvider } from './components/ThemeContext';
import './App.css';
import { WidthProvider } from './components/WidthContext';
import Header from './components/Header';
import Tasks from './components/Tasks';
import Auth from './components/Auth';

function App() {
  return (
    <ThemessProvider>
      <WidthProvider>
    <div>
      
    <Header/>
    
    <Tasks/>
    </div>
    </WidthProvider>
    
    </ThemessProvider>  
  );
}

export default App;
