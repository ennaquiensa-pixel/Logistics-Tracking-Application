import Hero from '../components/Hero'
import { Outlet } from "react-router-dom";
const HomePage = () => {
  return (
    <div>
      {/* <Header/> */}
      <Hero/>
      <Outlet />
    </div>
  )
}

export default HomePage