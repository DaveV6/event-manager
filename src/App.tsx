import Table from './table/page';
import { ThemeProvider } from "@/components/ThemeProvider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <section className='h-screen bg-background flex items-center'>
        <div className='container'>
          <h1 className='text-center font-bold text-primary text-pretty'>
            Event Manager
          </h1>
          <Table></Table>
        </div>
      </section>
    </ThemeProvider>
  )
}

export default App
