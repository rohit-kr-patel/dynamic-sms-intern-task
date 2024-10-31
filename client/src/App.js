import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/Auth/SignUp';
import SignIn from './components/Auth/SignIn';
import RegisterOperator from './components/CountryOperator/RegisterOperator';
import SendSMS from './components/SMS/SendSMS';
import StartProcess from './components/Process/StartProcess';
import StopProcess from './components/Process/StopProcess';
import RealTimeMetrics from './components/Dashboard/RealTimeMetrics';
import Dashboard from './components/Dashboard/Dashboard';
import CountryOperatorManagement from './components/CountryOperator/CountryOperatorManagement';
import ProcessControl from './components/Process/ProcessControl';
import LandingPage from './components/pages/LandingPage'; // Import the LandingPage component
import './styles.css';

const App = () => {
    return (
        <Router>
            <div>
                <h1>Dynamic SMS Management</h1>
                <Routes>
                    <Route path="/" element={<LandingPage />} /> {/* Landing page as the default route */}
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/register-operator" element={<RegisterOperator />} />
                    <Route path="/send-sms" element={<SendSMS />} />
                    <Route path="/start-process" element={<StartProcess />} />
                    <Route path="/stop-process" element={<StopProcess />} />
                    <Route path="/sms-metrics" element={<RealTimeMetrics />} />
                    <Route path="/country-operators" element={<CountryOperatorManagement />} />
                    <Route path="/process-control" element={<ProcessControl />} /> {/* Changed to element prop */}
                    <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard route */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
