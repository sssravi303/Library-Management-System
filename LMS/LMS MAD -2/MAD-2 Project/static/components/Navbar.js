import router from "../utils/router.js";
const Navbar = {
    template : `
<nav class = "shift-down">
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <router-link class="navbar-brand"to='/' > Home </router-link>
<div class="collapse navbar-collapse" id="navbarSupportedContent">
  <ul class="navbar-nav mr-auto">
    <li class="nav-item active">
  <router-link  class="nav-link"  v-if="!state.loggedIn" to='/login'> Login </router-link>
    </li>
      <li class="nav-item active">
  <router-link  class="nav-link" v-if="!state.loggedIn" to='/signup'> Signup </router-link>
    </li>
    <li class="nav-item active">
        <router-link class="nav-link" v-if="state.loggedIn" to='/profile'> Profile </router-link>
  </li>
    <li class="nav-item active">
  <router-link  class="nav-link"v-if="state.loggedIn && state.role === 'user'"  to="/user_dashboard">User Dashboard </router-link>
    </li>
   <li class="nav-item active">
  
   <router-link  class="nav-link" v-if="state.loggedIn && state.role === 'admin'" to="/admin_dashboard">Admin Dashboard </router-link>
     </li> 
   <li class="nav-item active">
   <router-link  class="nav-link" v-if="state.loggedIn && state.role === 'admin'" to="/edit_author"> Edit Author </router-link>
     </li>
       <li class="nav-item active">
  <router-link  class="nav-link" v-if="state.loggedIn && state.role === 'admin'" to="/edit_content"> Edit Content </router-link>
    </li>
      <li class="nav-item active">
  <router-link  class="nav-link" v-if="state.loggedIn && state.role === 'admin'" to="/check_requests"> Check Requests </router-link>
    </li>
      <li class="nav-item active">
  <router-link  class="nav-link" v-if="state.loggedIn && state.role === 'user'" to="/request_book">Request Book</router-link>
    </li>
      <li class="nav-item active">
  <router-link  class="nav-link" v-if="state.loggedIn && state.role === 'user'" to="/feedback">Feedback</router-link>
    </li>
      <li class="nav-item active">
  <router-link  class="nav-link" v-if="state.loggedIn && state.role === 'user'" :to="{name:'requesting_books', params: {user_id:state.id}}">Check Request Status </router-link>
    </li>    
  <li class="nav-item active">
  <router-link  class="nav-link" v-if="state.loggedIn && state.role === 'admin'" to="/delete_book">Delete Book</router-link>
    </li>
      <li class="nav-item active">
  <router-link  class="nav-link" v-if="state.loggedIn && state.role === 'admin'" to="/delete_section">Delete Section</router-link>
    </li>
      <li class="nav-item active">
  <router-link  class="nav-link" v-if="state.loggedIn && state.role === 'admin'" to="/add_book">Add Book</router-link>
    </li>
      <li class="nav-item active">
  <router-link  class="nav-link" v-if="state.loggedIn && state.role === 'admin'" to="/add_section">Add Section</router-link>
    </li>

<li class="nav-item active">
  <router-link  class="nav-link" v-if="state.loggedIn" to="/search_books">Search Books</router-link>
    </li>
    <li class="nav-item active">
  <router-link  class="nav-link" v-if="state.loggedIn" to="/edit_profile">Edit Profile</router-link>
    </li>

  <li class="nav-item active">
    <a   class="nav-link" v-if="state.loggedIn && state.role === 'admin'" href = "/stats"> View Stats </a>
      </li>
        <li class="nav-item active">
    <a   class="nav-link" v-if="state.loggedIn && state.role === 'admin'" href = "/start_export"> Export Monthly Report </a>
      </li>

          <li class="nav-item active">
    <a   class="nav-link" v-if="state.loggedIn" href = "/logout"> Logout </a>
      </li>
      </ul>
    </div>
</nav>
</nav>
`,

    data()
    {
        return{
            url : window.location.origin + "/logout"
        };
    },

    methods :   
    {
        logout_session()
        {
            sessionStorage.clear();
            router.push("/home");
        }
    },

computed : {
    state()
    {
        return this.$store.state 
    }
},
};

export default Navbar;
//<router-link v-if="state.loggedIn && state.role === 'user'" to="'/requested_books'" + "sessionStorage.getItem('id')"> Check Request Status </router-link>

{/* <li class="nav-item active">
<router-link  class="nav-link" v-if="state.loggedIn && state.role === 'admin'" to="/view_feedback">View Feedback</router-link>
  </li> */}