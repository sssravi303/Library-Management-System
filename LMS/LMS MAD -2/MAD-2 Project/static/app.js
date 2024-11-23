import Navbar from "./components/Navbar.js";
import router from "./utils/router.js";
import store from "./utils/store.js";
// import store from "./utils/store.js";

new Vue(
    {
        el:"#app",
        template : 
        `<div>
            <Navbar/>
            <router-view/>
        </div>
        `,
        router,
        store,
        components : {
            Navbar, 
    },
}
);

// navbar and router-view will be on every page