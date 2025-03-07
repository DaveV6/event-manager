import Table from './table/page'
import { ThemeProvider } from "@/components/ThemeProvider"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <section className='bg-background flex items-center py-10 min-h-screen h-full'>
        <div className='container'>
          <h1 className='text-center font-bold text-primary text-pretty text-3xl'>
            Event Manager
          </h1>
          <Table></Table>
        </div>
      </section>
    </ThemeProvider>
  )
}

export default App
