import {useState, createContext} from "react"
const context=createContext()
export function ThemessProvider({children}){
    const [theme, setTheme]=useState(false)
    const contextValue={theme,setTheme}
    return(
        <context.Provider value={contextValue}>
            {children}
        </context.Provider>
    )
}
export {context}