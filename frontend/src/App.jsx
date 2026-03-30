
import Navbar from "./components/Navbar"
import { RouterProvider } from "react-router-dom";

import { router } from "./app/router"

import { AuthProvider } from "./features/auth/AuthProvider"
import { InterviewProvider } from "./features/interview/InterviewProvider";

function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
      
        <RouterProvider router={router} />
       
      </InterviewProvider>
    </AuthProvider>
  );
}

export default App;




