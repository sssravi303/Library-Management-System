import router from "../utils/router.js";

const Edit_author = {
    template : 
    `<div class="d-flex justify-content-center align-items-center vh-100">
      <div class="card shadow p-4 border rounded-3 ">
        <h3 class="card-title text-center mb-4">EDIT AUTHOR</h3>
        <div class="form-group mb-3">
          <input v-model="book_id" type="text" class="form-control" placeholder="Book ID" required/>
        </div>
        <div class="form-group mb-4">
          <input v-model="author_name" type="text" class="form-control" placeholder="New Author Name" required/>
        </div>
        <button class="btn btn-primary w-100" @click="submitInfo">Submit</button>
      </div>
        </div>
        `,

    data()
    {
        return {  
            book_id : "",
            author_name : "",
            description : "",
            role :"",
        };
    },

    methods:{
        async submitInfo(){
            const url = window.location.origin;
            const res = await fetch(url+'/edit_author',{
                method : 'POST',
                headers : {
                    "Content-Type":"application/json"
                },
                //sending the post body request
                body : JSON.stringify({book_id:this.book_id,author_name:this.author_name,
                  role:sessionStorage.getItem('role')}),
            });

            if(res.ok)
            {
              const data = await res.json(); // await because it is actually the response we need that data

              console.log(sessionStorage.getItem('email'));
              console.log(sessionStorage.getItem('role'));

              router.push("/admin_dashboard");
            }
            else{
              console.log("Editing Author Failed");
            }
        },
    },
};

export default Edit_author;