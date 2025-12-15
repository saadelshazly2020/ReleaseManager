import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './Layout';

// Pages
import Dashboard from './pages/Dashboard';
import Releases from './pages/Releases';
import ReleaseItems from './pages/ReleaseItems';
import Projects from './pages/Projects';
import Teams from './pages/Teams';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Layout currentPageName="Dashboard"><Dashboard /></Layout>} />
                    <Route path="/releases" element={<Layout currentPageName="Releases"><Releases /></Layout>} />
                    <Route path="/releaseitems" element={<Layout currentPageName="ReleaseItems"><ReleaseItems /></Layout>} />
                    <Route path="/projects" element={<Layout currentPageName="Projects"><Projects /></Layout>} />
                    <Route path="/teams" element={<Layout currentPageName="Teams"><Teams /></Layout>} />
                </Routes>
            </Router>
        </QueryClientProvider>
    );
}

export default App;