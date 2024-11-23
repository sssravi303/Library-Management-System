import router from "../utils/router.js";

const Feedback = {
    template : 
    `<div class="d-flex justify-content-center align-items-center vh-100">
      <div class="card shadow p-4 border rounded-3 ">
        <h3 class="card-title text-center mb-4">FEEDBACK OF BOOKS</h3>
        <div class="form-group mb-3">
          <input v-model="book_id" type="text" class="form-control" placeholder="Book ID" required/>
        </div>
        <div class="form-group mb-3">
          <input v-model="rating" type="text" class="form-control" placeholder="rating" required/>
        </div>

        <div class="form-group mb-3">
          <input v-model="description" type="text" class="form-control" placeholder="description" required/>
        </div>
        <button class="btn btn-primary w-100" @click="submitInfo">Submit</button>
      </div>
        </div>
        `,

    data()
    {
        return {  
            book_id : "",
            rating : "",
            description : "",
            role :"",
            user_id :""
        };
    },

    methods:{
        async submitInfo(){
            const url = window.location.origin;
            const res = await fetch(url+'/feedback',{
                method : 'POST',
                headers : {
                    "Content-Type":"application/json"
                },
                //this because we need to get our own
                body : JSON.stringify({user_id:sessionStorage.getItem('id'),book_id:this.book_id,rating:this.rating,description:this.description,
                  role:sessionStorage.getItem('role')}),
            });

            if(res.ok)
            {
              const data = await res.json(); // await because it is actually the response we need that data
              // sessionStorage.setItem('token',data.token);
              // sessionStorage.setItem('role',data.role);
              // sessionStorage.setItem('email',data.email);
              // sessionStorage.setItem('id',data.id);

              console.log(sessionStorage.getItem('email'));
              console.log(sessionStorage.getItem('role'));

              router.push("/user_dashboard");
            }
            else{
              console.log("Failed");
            }
        },
    },
};

export default Feedback;