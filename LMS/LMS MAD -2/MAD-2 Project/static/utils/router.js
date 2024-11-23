// import Navbar from "../components/Navbar";
import Home from "../pages/Home.js";
import Login from "../pages/Login.js";
import Logout from "../pages/Logout.js";
import Signup from "../pages/Signup.js";
import Profile from "../pages/Profile.js";
import DashBoardStud from "../pages/DashboardStud.js";
import DashBoardAdmin from "../pages/Admin_dashboard.js";
import Req from "../pages/Request_page.js";
import Add_book from "../pages/Add_book.js";
import Add_section from "../pages/Add_section.js";
import Delete_Section from "../pages/Delete_sec.js";
import Deletebook from "../pages/Delete_book.js";
import Req_Books from "../pages/Requested_books.js";
import Check_Req from "../pages/Check_requests.js";
import Edit_author from "../pages/Edit_author.js";
import Edit_content from "../pages/Edit_content.js";
import Feedback from "../pages/Feedback.js";
import GetBooks from "../pages/Search_by_books.js";
import Search_word from "../pages/Search_books.js";
import Edit_profile from "../pages/Edit_Profile.js";
// import Feedback_admin from "../pages/View_Feedback.js";
import store from "./store.js"


const routes = [{path : '/', component : Home},
    {path : '/login', component : Login},   
    {path : '/logout', component : Logout},
    {path : '/profile', component : Profile , meta : {requiresLogin : true }},
    {path : '/res_books', component : GetBooks , meta : {requiresLogin : true }},
    {path : '/search_books', component : Search_word , meta : {requiresLogin : true }},
    {path : '/edit_profile', component : Edit_profile , meta : {requiresLogin : true }},
    {path : '/Signup', component : Signup},
    {path : '/admin_dashboard', component : DashBoardAdmin,meta : {requiresLogin : true,role : "admin"}},
    {path : '/check_requests', component : Check_Req ,meta : {requiresLogin : true,role : "admin"} },
    {path : '/user_dashboard', component : DashBoardStud, meta : {requiresLogin : true,role : "user"}},
    {path : '/feedback', component : Feedback,meta : {requiresLogin : true,role : "user"}},
    // {path : '/view_feedback', component : Feedback_admin ,meta : {requiresLogin : true,role : "admin"}},
    {path : '/request_book/', component : Req, meta : {requiresLogin : true,role : "user"}}, 
    {path : '/requested_books/:user_id', component : Req_Books, name : 'requesting_books',meta : {requiresLogin : true,role : "user"}} ,
    {path : '/add_book', component : Add_book,meta : {requiresLogin : true,role : "admin"}},
    {path : '/add_section', component : Add_section,meta : {requiresLogin : true,role : "admin"}},
    {path : '/delete_section', component : Delete_Section,meta : {requiresLogin : true,role : "admin"}},
    {path : '/delete_book', component : Deletebook,meta : {requiresLogin : true,role : "admin"}},
    {path : '/edit_author', component : Edit_author,meta : {requiresLogin : true,role : "admin"}},
    {path : '/edit_content', component : Edit_content,meta : {requiresLogin : true,role : "admin"}}
];

const router = new VueRouter({
  mode :'history',
    routes,
});

// router.beforeEach((to,from,next) => {
//     if(to.matched.some((record) => record.meta.requiresLogin)){
//         // if(!store.state.loggedIn){
//         //     next({path : "/login"});
//         // }
//      if(to.meta.role && to.meta.role!=store.state.loggedIn)
//     {
//         next({path : "/"})
//     }
//     else{
//         next();
//     }
//     }
//     else{
//         next();
//     }
// })

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresLogin)) {
    if (!store.state.loggedIn) {
      next({ path: "/login" });
  } 
    // else if () {
    //     next({ path: "/login" });
    //   } 
     if (to.meta.role && to.meta.role !== store.state.role) {
        next({ path: router.currentRoute.path});
      } 
      
      else {
        next();
      }
    } else {
      next();
    }
  });

export default router;