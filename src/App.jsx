import './App.css';
import Header from './components/Header'
import { Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider} from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <header >
        <Header/>
        <Outlet />
      </header>
    </QueryClientProvider>
  );
}

export default App;
