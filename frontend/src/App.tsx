import { useState } from 'react'
import Layout from './components/Layout/Layout'
import Dashboard from './features/dashboard/Dashboard/Dashboard'
import Inventory from './features/inventory/Inventory/Inventory'
import Recipe from './features/recipe/Recipe'
import StyleExplorer from './features/style/StyleExplorer'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'home' && <Dashboard />}
      {activeTab === 'inventory' && <Inventory />}
      {activeTab === 'recipes' && <Recipe />}
      {activeTab === 'styles' && <StyleExplorer />}
    </Layout>
  )
}

export default App
