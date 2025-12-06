

import Auth from "@/components/auth"

const App = () => {
    let user:boolean = false 
    if(!user) return <div className="container h-screen mx-auto max-w-7xl"><Auth /></div>
  return (
    <div>
      App
    </div>
  )
}

export default App
