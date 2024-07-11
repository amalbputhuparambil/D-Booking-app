import React from 'react'
import Navbar from '../../components/doctor/Navbar/Navbar'
import Footer from '../../components/doctor/Footer/Footer'
import ScheduleSlotPage from '../../components/doctor/Scheduleslot'


const SlotPage:React.FC = () => {
  return (
    <>
    <Navbar/> 
    <ScheduleSlotPage/>
    <Footer />
    </>
    
  )
}

export default SlotPage