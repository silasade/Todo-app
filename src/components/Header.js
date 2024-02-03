import { useEffect, useState, useContext } from "react";
import { TweenMax, Power3 } from "gsap"; // Import TweenMax and Power3
import moon from '../images/icon-moon.svg';
import sun from "../images/icon-sun.svg";
import { context } from "./ThemeContext";
import { Widthcontext } from "./WidthContext";
import desktop_dark from "../images/bg-desktop-dark.jpg";
import mobile_dark from "../images/bg-mobile-dark.jpg";
import desktop_light from "../images/bg-desktop-light.jpg";
import mobile_light from "../images/bg-mobile-light.jpg";
import { auth } from "./config/FirebaseConfig";
import Notice from "./Notice";
import Auth from "./Auth";
import gsap from "gsap";
function Header() {
    const [user, setUser] = useState(false);
    const [name, setName] = useState("");
    const [profilePic, setProfile] = useState("");

    const { theme, setTheme } = useContext(context);
    const { windowWidth, setWindowWidth } = useContext(Widthcontext);

    const style_desktop = {
        backgroundImage: `url(${theme ? desktop_light : desktop_dark})`,
    };

    const style_mobile = {
        backgroundImage: `url(${theme ? mobile_light : mobile_dark})`,
    };

    useEffect(() => {
        const handleWidth = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleWidth);
        return () => {
            window.removeEventListener('resize', handleWidth);
        };
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(true);
                setName(getFirstName(user.displayName));
                setProfile(user.photoURL);

                // Animate profile picture slide in from the right using GSAP
            } else {
                setUser(false);
                setName("");
                setProfile("");
            }
        });

        return () => unsubscribe();
    }, []);
    useEffect(() => {
        gsap.to(".profile", {
        
            x:  '-15%',
            duration: 1.2,
            ease: "power2.inOut",
        });
    }, [user]);
    const handleTheme = () => {
        setTheme(!theme);
    };

    const getFirstName = (fullName) => {
        if (fullName) {
            return fullName.split(' ')[0];
        }
        return "";
    };

    return (
        <div className="test" style={windowWidth <= 500 ? style_mobile : style_desktop}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", alignContent: "flex-end" ,marginRight:'100px', width:"100%"}}>
                {!user && <Notice />}
                
            </div>
            <div style={{display:"flex", justifyContent:"space-between", paddingTop:"5%",paddingLeft:"4%", alignItems:"center"}}>
            <Auth />
            {user &&
                <div className="profile" style={{display:"flex", flexDirection:"row", justifyContent:"flex-end", alignContent:"center"}}>
                    <h3 style={{ color: "white" }}>Welcome, {name} &nbsp;</h3>
        
                </div>
            }
            </div>
            <div className="header">
                <div>
                    <h1>TODO</h1>
                </div>
                <div>
                    <img onClick={handleTheme} className="theme" src={theme ? moon : sun} alt="sun/moon" />
                </div>
            </div>
        </div>
    );
}

export default Header;
