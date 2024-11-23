import router from "../utils/router.js";

const Add_section = {
    template : 
    `<div class="d-flex justify-content-center align-items-center vh-100">
      <div class="card shadow p-4 border rounded-3 ">
        <h3 class="card-title text-center mb-4">ADD SECTION</h3>
        <div class="form-group mb-3">
          <input v-model="section_id" type="text" class="form-control" placeholder="Section ID" required/>
        </div>
        <div class="form-group mb-4">
          <input v-model="section_name" type="text" class="form-control" placeholder="Section Name" required/>
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
            section_id : "",
            section_name : "",
            description : "",
            role :"",
        };
    },

    methods:{
        async submitInfo(){
            const url = window.location.origin;
            const res = await fetch(url+'/add_section',{
                method : 'POST',
                headers : {
                    "Content-Type":"application/json"
                },
                //this because we need to get our own
                body : JSON.stringify({section_id:this.section_id,section_name:this.section_name,description:this.description,
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

              router.push("/admin_dashboard");
            }
            else{
              console.log("Section Upload Failed");
            }
        },
    },
};

export default Add_section;