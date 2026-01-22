import { useState } from 'react'
import { TabBar, type Tab } from './components/ui/TabBar'
import { BoardsPage } from './pages/BoardsPage'
import { BoardDetailPage } from './pages/BoardDetailPage'

const tabs: Tab[] = [
  { id: 'boards', label: 'Boards', icon: '📋' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

/**
 * Placeholder Settings page
 */
const SettingsPage = () => (
  <div className="p-6">
    <h1 className="font-['Kalam'] text-4xl text-[#2d2d2d] mb-4">Settings</h1>
    <p className="font-['Patrick_Hand'] text-lg text-[#2d2d2d]/70">
      App settings and preferences
    </p>
  </div>
)

/**
 * Main App shell with TabBar navigation
 *
 * Features:
 * - Bottom TabBar for navigation
 * - Paper texture background
 * - Safe area handling for iOS
 * - Switching between Boards and Settings views
 * - Board detail view with back navigation
 */
export const App = () => {
  const [activeTab, setActiveTab] = useState('boards')
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null)

  const handleBoardSelect = (boardId: string) => {
    setSelectedBoardId(boardId)
  }

  const handleBackToList = () => {
    setSelectedBoardId(null)
  }

  // Determine what to show in the boards tab
  const renderBoardsContent = () => {
    if (selectedBoardId) {
      return (
        <BoardDetailPage
          boardId={selectedBoardId}
          onBack={handleBackToList}
        />
      )
    }
    return <BoardsPage onBoardSelect={handleBoardSelect} />
  }

  return (
    <div className="min-h-screen min-h-[100dvh]">
      <main className="pb-20">
        {activeTab === 'boards' && renderBoardsContent()}
        {activeTab === 'settings' && <SettingsPage />}
      </main>

      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab)
          // Clear board selection when switching tabs
          if (tab !== 'boards') {
            setSelectedBoardId(null)
          }
        }}
      />
    </div>
  )
}

export default App
