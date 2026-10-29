import { ApiStatus } from './components/ApiStatus'

function App() {
  return (
    <div className="shell">
      <header className="topbar">
        <span className="brand">Docs Assistant</span>
        <ApiStatus />
      </header>

      <main className="hero">
        <h1>Ask questions about your documents</h1>
        <p>
          Upload PDFs and text files, then get answers that cite the exact
          passages they came from.
        </p>
      </main>
    </div>
  )
}

export default App
