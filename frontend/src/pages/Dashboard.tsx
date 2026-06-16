// import React from 'react';
// import { useAuth } from '../context/AuthContext';
// import ManagerDashboard from '../components/dashboardByRole/ManagerDashboard';
// // import LivreurDashboard from '../components/dashboardByRole/LivreurDashboard';
// import ClientDashboard from '../components/dashboardByRole/ClientDashboard';
// import DriverDashboard from '../components/DriverDashboard';
// import AdminDashboard from '../components/admin/AdminDashboard';


// const Dashboard: React.FC = () => {
//   const { user } = useAuth();

//   const renderDashboard = () => {
//     switch (user?.role) {
//       case 'ADMIN':
//         return <AdminDashboard />;
//       case 'MANAGER':
//         return <ManagerDashboard />;
//       case 'LIVREUR':
//         return <DriverDashboard />;
//       case 'CLIENT':
//         return <ClientDashboard />;
//       default:
//         return <ClientDashboard />;
//     }
//   };

//   return renderDashboard();
// };

// export default Dashboard;