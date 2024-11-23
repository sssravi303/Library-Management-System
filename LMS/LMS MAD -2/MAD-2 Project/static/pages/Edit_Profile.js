import router from "../utils/router.js";

const Edit_profile = {
    template : 
    `<div class="d-flex justify-content-center align-items-center vh-100">
      <div class="card shadow p-4 border rounded-3 ">
        <h3 class="card-title text-center mb-4">EDIT PROFILE</h3>
        <div class="form-group mb-3">
          <input v-model="old_email" type="text" class="form-control" placeholder="Old Email-ID" required/>
        </div>
        <div class="form-group mb-4">
          <input v-model="new_email" type="text" class="form-control" placeholder="New Email" required/>
        </div>
        <button class="btn btn-primary w-100" @click="submitInfo">Submit</button>
      </div>
        </div>
        `,

    data()
    {
        return {  
            old_email : "",
            new_email : "",
            description : "",
            role :"",
        };
    },

    methods:{
        async submitInfo(){
            const url = window.location.origin;
            const res = await fetch(url+'/edit_profile',{
                method : 'POST',
                headers : {
                    "Content-Type":"application/json"
                },
                //sending the post body request
                body : JSON.stringify({old_email:this.old_email,new_email:this.new_email,
                  role:sessionStorage.getItem('role')}),
            });

            if(res.ok)
            {
              const data = await res.json(); // await because it is actually the response we need that data

              console.log(sessionStorage.getItem('email'));
              console.log(sessionStorage.getItem('role'));

              router.push("/logout");
            }
            else{
              console.log("Editing Profile Failed");
            }
        },
    },
};

export default Edit_profile;