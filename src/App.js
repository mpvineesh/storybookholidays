import './App.css';
import AppRoutes from './routes';
import { RegionProvider } from './context/RegionContext';

function App() {
  return (
    <RegionProvider>
      <AppRoutes />
    </RegionProvider>
  );
}

export default App;
