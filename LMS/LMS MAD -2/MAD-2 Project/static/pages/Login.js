import router from "../utils/router.js";
const Login = {
    template : 
    `<div class="d-flex justify-content-center align-items-center vh-100">
      <div class="card shadow p-4 border rounded-3 ">
        <h3 class="card-title text-center mb-4">Login</h3>
        <div class="form-group mb-3">
          <input v-model="email" type="email" class="form-control" placeholder="Email" required/>
        </div>
        <div class="form-group mb-4">
          <input v-model="password" type="password" class="form-control" placeholder="Password" required/>
        </div>
        <button class="btn btn-primary w-100" @click="submitInfo">Submit</button>
      </div>
    </div>`,

    data()
    {
        return {  
            email : "",
            password : "",
            role : ""
        };
    },

    methods:{
        async submitInfo(){
            const url = window.location.origin;
            const res = await fetch(url+'/user-login',{
                method : 'POST',
                headers : {
                    "Content-Type":"application/json"
                },
                //this because we need to get our own
                body : JSON.stringify({email:this.email,password:this.password,role:this.role}),
            });

            if(res.ok)
            {
              const data = await res.json(); // await because it is actually the response we need that data
              sessionStorage.setItem('token',data.token);
              sessionStorage.setItem('role',data.role);
              sessionStorage.setItem('email',data.email);
              sessionStorage.setItem('id',data.id);

              
              this.$store.commit('setLogin',true);
              this.$store.commit('setRole',data.role);
              this.$store.commit('setId',data.id);

              if (sessionStorage.getItem('role') == 'user')
              {
                  router.push("/user_dashboard");
                
              }

              else if(sessionStorage.getItem('role')=='admin')
              {
                router.push("/admin_dashboard");
              }
            }

            else{
              router.push("/signup");
            }
        },
    },
};

export default Login;