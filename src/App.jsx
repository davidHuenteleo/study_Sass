//import styles SASS
import "./styles/styles.scss"

//import components
import { Navbar } from './components/Navbar'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Footer } from './components/Footer'

function App() {
  return (
    <>
      <Navbar />

      <Header />
      <Hero />
      <Footer />
    </>
  )
}

export default App;
