import {useState, createContext} from "react"
const Widthcontext=createContext()
export function WidthProvider({children}){
    const [windowWidth, setWindowWidth]=useState()
    const contextValue={windowWidth, setWindowWidth}
    return(
        <Widthcontext.Provider value={contextValue}>
            {children}
        </Widthcontext.Provider>
    )
}
export {Widthcontext}