import './App.css'
import Table from './table/page'

function App() {
  return (
    <>
      <section className='h-screen bg-linear-to-r from-cyan-500 to-blue-500 flex items-center'>
        <div className='container'>
          <h1 className='text-center font-bold'>
            Event Manager
          </h1>
          <Table></Table>
        </div>
      </section>
    </>
  )
}

export default App
