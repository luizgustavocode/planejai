import { SimulationResultsPage } from './pages/SimulationResultsPage'
import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './components/RootLayout'
import { SimulationFormPage } from './pages/SimulationFormPage'
import { SimulationHistoryPage } from './pages/SimulationHistoryPage'

export const router = createBrowserRouter([
 {
  element: <RootLayout />,
  children: [
   {
    path: '/',
    element: <SimulationFormPage />,
   },
   {
    path: '/resultado/:id',
    element: <SimulationResultsPage />,
   },
   {
    path: '/historico/:id',
    element: <SimulationHistoryPage />,
   },
   {
    path: '/historico/:',
    element: <SimulationHistoryPage />,
   },
  ],
 },
])
