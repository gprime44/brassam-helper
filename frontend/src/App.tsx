import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './features/dashboard/Dashboard/Dashboard'
import Inventory from './features/inventory/Inventory/Inventory'
import InventoryDetailWrapper from './features/inventory/InventoryDetail/InventoryDetailWrapper'
import Recipe from './features/recipe/Recipe'
import RecipeDetailWrapper from './features/recipe/RecipeDetailWrapper'
import StyleExplorer from './features/style/StyleExplorer'
import StyleDetailWrapper from './features/style/StyleDetail/StyleDetailWrapper'
import './App.css'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventory/:category/:id" element={<InventoryDetailWrapper />} />
          
          <Route path="/recipes" element={<Recipe />} />
          <Route path="/recipes/:id" element={<RecipeDetailWrapper />} />
          
          <Route path="/styles" element={<StyleExplorer />} />
          <Route path="/styles/:id" element={<StyleDetailWrapper />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
