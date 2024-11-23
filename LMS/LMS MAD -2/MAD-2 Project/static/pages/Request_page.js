import StudyResource from "../components/StudyResource.js";
import router from "../utils/router.js";

const Req = {
    template : `
    <div>
    <center> <h1> REQUEST BOOK </h1> </center>
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="card shadow p-4 border rounded-3 ">
        <h3 class="card-title text-center mb-4"></h3>
        <div class="form-group mb-3">
          <input v-model="email" type="email" class="form-control" placeholder="E-Mail" required/>
        </div>
        <div class="form-group mb-3">
          <input v-model="req_book_id" type="text" class="form-control" placeholder="BOOK-ID" required/>
        </div>
        <button class="btn btn-primary w-100" @click="submitInfo"> Submit</button>
      </div>
    </div>
    </div>`,
    data()
    {
        return {
              email : "",
              req_book_id : "",
              role : "",
            
        };
    },

    methods:{
        async submitInfo(){
            const url = window.location.origin;
            const res = await fetch(url+'/request_book',{
                method : 'POST',
                headers : {
                    "Content-Type":"application/json"
                },
                //this because we need to get our own
                body : JSON.stringify({email:this.email,req_book_id:this.req_book_id}),
            });
            if(res.ok)
            {
              console.log("ok");
              const data = await res.json(); // await because it is actually the response we need that data
              // sessionStorage.setItem('token',data.token);
              sessionStorage.setItem('req_book_id',data.req_book_id);
              // sessionStorage.setItem('email',data.email);
              // sessionStorage.setItem('role',data.role);
              
              router.push("/user_dashboard");
            }
            
            else{
              console.log("Request Failed");
            }
        },
    },
};

export default Req;