import router from "../utils/router.js";

const Deletebook = {
    template : `
    <div>
    <center> <h1> DELETE BOOK </h1> </center>
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="card shadow p-4 border rounded-3 ">
        <h3 class="card-title text-center mb-4"></h3>
        <div class="form-group mb-3">
          <input v-model="del_book_id" type="text" class="form-control" placeholder="BOOK-ID" required/>
        </div>
        <button class="btn btn-primary w-100" @click="submitInfo"> Submit</button>
      </div>
    </div>
    </div>`,
    data()
    {
        return {
            del_book_id : "",
            role : "",
        };
    },

    methods:{
        async submitInfo(){
            const url = window.location.origin;
            const res = await fetch(url+'/delete_book',{
                method : 'POST',
                headers : {
                    "Content-Type":"application/json"
                },
                //this because we need to get our own
                body : JSON.stringify({del_book_id:this.del_book_id,role:sessionStorage.getItem('role')}),
            });

            
            if(res.ok)
            {
              console.log("ok");
              const data = await res.json(); // await because it is actually the response we need that data
              // sessionStorage.setItem('token',data.token);
              sessionStorage.setItem('del_book_id',data.del_book_id);
              // sessionStorage.setItem('role',data.role);

              console.log(sessionStorage.getItem('token'));
              console.log(sessionStorage.getItem('role'));
              
              router.push("/admin_dashboard");
            }
            else{
              console.log("Delete Failed");
            }
        },
    },
};

export default Deletebook;