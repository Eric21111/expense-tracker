import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { SidebarProvider } from "./contexts/SidebarContext";
import Header from "./components/shared/Header";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/register";
import Home from "./pages/Home"
import About from "./pages/About"
import Dashboard from "./pages/Dashboard"
import Settings from "./pages/settings"

const AnimatedRoutes = () => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = React.useState(location);
  const [transitionStage, setTransitionStage] = React.useState("enter");
  const [previousPath, setPreviousPath] = React.useState(location.pathname);

  const publicRoutes = ["/", "/login", "/register", "/about"];
  const isPublicRoute = (path) => publicRoutes.includes(path);

  React.useEffect(() => {
   
    if (!isPublicRoute(location.pathname) || !isPublicRoute(displayLocation.pathname)) {
      setDisplayLocation(location);
      setTransitionStage("enter");
      return;
    }


    if (location !== displayLocation && isPublicRoute(location.pathname) && isPublicRoute(displayLocation.pathname)) {
    
      const prevPath = displayLocation.pathname;
      

      if (prevPath === "/login" && location.pathname === "/") {
        setTransitionStage("exit-fade");
      } else if (prevPath === "/register") {

        setPreviousPath(prevPath);
        setTransitionStage("exit-right");
      } else if (prevPath === "/login" && location.pathname === "/register") {
     
        setPreviousPath(prevPath);
        setTransitionStage("exit");
      } else {
        setPreviousPath(prevPath);
        setTransitionStage("exit");
      }
    }
  }, [location, displayLocation]);

  React.useEffect(() => {
  
    if (!isPublicRoute(location.pathname)) {
      return;
    }

    if (transitionStage === "exit" || transitionStage === "exit-fade" || transitionStage === "exit-right") {
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        
        if (location.pathname === "/") {
          
          setTransitionStage("enter-left");
        } else if (location.pathname === "/register") {
         
          setTransitionStage("enter");
        } else if (location.pathname === "/login") {
        
          if (previousPath === "/register") {
            setTransitionStage("enter-left");
          } else {
            setTransitionStage("enter");
          }
        } else {
          
          setTransitionStage("enter");
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [transitionStage, location, previousPath]);

  const shouldAnimate = isPublicRoute(displayLocation.pathname) && isPublicRoute(location.pathname);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <div
        key={displayLocation.pathname}
        className={shouldAnimate ? `transition-wrapper-${transitionStage}` : ""}
        style={{
          width: "100%",
          minHeight: "100vh",
          position: shouldAnimate && (transitionStage === "exit" || transitionStage === "exit-fade" || transitionStage === "exit-right") ? "absolute" : "relative",
          top: 0,
          left: 0,
        }}
      >
        <Routes location={displayLocation}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

function AppContent() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const checkAuth = React.useCallback(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  React.useEffect(() => {

    checkAuth();

    
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);


    const handleCustomStorageChange = () => {
      checkAuth();
    };
    window.addEventListener("userStorageChange", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userStorageChange", handleCustomStorageChange);
    };
  }, [checkAuth, location]);

  return (
    <>
      {!isLoggedIn && <Header />}
      <AnimatedRoutes />
    </>
  );
}

function App() {
  return (
    <SidebarProvider>
      <Router>
        <AppContent />
      </Router>
    </SidebarProvider>
  );
}

export default App;
