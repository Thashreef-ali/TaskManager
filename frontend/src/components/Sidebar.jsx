import { Sparkles ,Home,ListChecks,CheckCircle2, Lightbulb,Menu, X} from "lucide-react";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function Sidebar({user, tasks}) {
  const SIDEBAR_CLASSES = {
    desktop:
      "hidden md:flex flex-col fixed h-full w-20 lg:w-64 bg-white/90 backdrop-blur-sm border-r border-purple-100 shadow-sm z-20 transition-all duration-300",
    mobileButton:
      "absolute md:hidden top-25 left-5 z-50 bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition",
    mobileDrawerBackdrop: "fixed inset-0 bg-black/40 backdrop-blur-sm",
    mobileDrawer:
      "absolute top-0 left-0 w-64 h-full bg-white/90 backdrop-blur-md border-r border-purple-100 shadow-lg z-50 p-4 flex flex-col space-y-6",
  };
  const PRODUCTIVITY_CARD = {
    container: "bg-purple-50/50 rounded-xl p-3 border border-purple-100",
    header: "flex items-center justify-between mb-2",
    label: "text-xs font-semibold text-purple-700",
    badge: "text-xs bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full",
    barBg: "w-full h-2 bg-purple-200 rounded-full overflow-hidden",
    barFg: "h-full bg-gradient-to-r from-fuchsia-500 to-purple-600 animate-pulse",
}
const menuItems = [
    { text: "Dashboard", path: "/", icon: <Home className="w-5 h-5" /> },
    { text: "Pending Tasks", path: "/pending", icon: <ListChecks className="w-5 h-5" /> },
    { text: "Completed Tasks", path: "/complete", icon: <CheckCircle2 className="w-5 h-5" /> },
]
const LINK_CLASSES = {
    base: "group flex items-center px-4 py-3 rounded-xl transition-all duration-300",
    active: "bg-gradient-to-r from-purple-50 to-fuchsia-50 border-l-4 border-purple-500 text-purple-700 font-medium shadow-sm",
    inactive: "hover:bg-purple-50/50 text-gray-600 hover:text-purple-700",
    icon: "transition-transform duration-300 group-hover:scale-110 text-purple-500",
    text: "text-sm font-medium ml-2",
}
const TIP_CARD = {
    container: "bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-xl p-4 border border-purple-100",
    iconWrapper: "p-2 bg-purple-100 rounded-lg",
    title: "text-sm font-semibold text-gray-800",
    text: "text-xs text-gray-600 mt-1",
}
  const [mobileOpen, setmobileOpen] = useState(false);
  const [showModel, setshowModel] = useState(false);
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((t) => t.completed).length || 0;
  const productivity =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const username = user?.name || "User";
  const initial = username.charAt().toUpperCase();

  useEffect(()=>{
    document.body.style.overflow = mobileOpen ? 'hidden' : 'auto'
    return ()=>{document.body.style.overflow = 'auto'}
  },[mobileOpen])
  
 const renderMenuitems = (isMobile = false) => (
  <ul className="space-y-2">
    {menuItems.map(({ text, path, icon }) => (
      <li key={text}>
        <NavLink
          to={path}
          className={({ isActive }) =>
            [
              LINK_CLASSES.base,
              isActive ? LINK_CLASSES.active : LINK_CLASSES.inactive,
              isMobile ? "justify-start" : "lg:justify-start",
            ].join(" ")
          }
          onClick={() => setmobileOpen(false)}
        >
          <span className={LINK_CLASSES.icon}>{icon}</span>
          <span
            className={`${isMobile ? "block" : "hidden lg:block"} ${
              LINK_CLASSES.text
            }`}
          >
            {text}
          </span>
        </NavLink>
      </li>
    ))}
  </ul>
);

  return (
    <>
      <div className={SIDEBAR_CLASSES.desktop}>
        <div className=" p-5 border-b border-purple-100 lg:block hidden">
          <div className=" flex items-center gap-3">
            <div
              className=" w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600
            flex items-center justify-center text-white font-bold shadow-md"
            >
              {initial}
            </div>
            <div>
              <h2 className=" text-lg font-bold text-gray-800">
                Hey. {username}
              </h2>
              <p className="text-sm text-purple-500 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3"/> Let's crush some tasks!
              </p>
            </div>
          </div>
        </div>
        <div className="p4 space-y-6 overflow-y-auto flex-1">
          <div className={PRODUCTIVITY_CARD.container}>
            <div className={PRODUCTIVITY_CARD.header}>
              <h3 className={PRODUCTIVITY_CARD.label}>PRODUCTIVITY</h3>
              <span className={PRODUCTIVITY_CARD.badge}>{productivity}%</span>
            </div>
            <div className={PRODUCTIVITY_CARD.barBg}>
              <div className={PRODUCTIVITY_CARD.barFg} style={{width:`${productivity}%`}}/>

              
            </div>
          </div>
          {renderMenuitems()}
          <div className=" mt-auto pt-6 lg:block hidden">
            <div className={TIP_CARD.container}>
              <div className="flex items-center gap-2">
                 <div className={TIP_CARD.iconWrapper}>
                  <Lightbulb className="w-5 h-5 text-purple-500"/>
                 </div>
                 <div >
                  <h3 className={TIP_CARD.title}>Pro Tip</h3>
                  <p className={TIP_CARD.text}>Use keyboard shortcut to boost productivity</p>
                  <a href="https://wa.me/9846585305" target="_blank" className="block mt-2 text-sm text-purple-500
                  hover:underline">Visit </a>
                 </div>
              </div>
            </div>
          </div>


        </div>
      </div>
      {/* mobile */}
      {!mobileOpen && (
        <button onClick={()=>setmobileOpen(true)}
        className={SIDEBAR_CLASSES.mobileButton}>
           <Menu className='w-5 h-5 '/>
        </button>
      )}

      {/*  */}
      {mobileOpen && (
        <div className=" fixed inset-0 z-40">
          <div className={SIDEBAR_CLASSES.mobileDrawerBackdrop} onClick={()=>setmobileOpen(false)}/>

            <div className={SIDEBAR_CLASSES.mobileDrawer} onClick={(e)=>e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-lg font-bold text-purple-500">Menu</h2>
                <button className="text-gray-700 hover:text-purple-600" onClick={()=>setmobileOpen(false)}>
                  <X className=" w-5 h-5"/>
                </button>
              </div>
             
             <div className="flex items-center gap-3 mb-6">
              <div className=" w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600
            flex items-center justify-center text-white font-bold shadow-md">
              {initial}
            </div>

             <div>
              <h2 className=" text-lg font-bold text-gray-800 mt-16">
                Hey. {username}
              </h2>
              <p className="text-sm text-purple-500 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3"/> Let's crush some tasks!
              </p>
            </div>

             </div>
              
              {renderMenuitems(true)}

            </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
