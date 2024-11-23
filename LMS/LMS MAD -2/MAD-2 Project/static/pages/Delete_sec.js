import router from "../utils/router.js";

const Delete_Section = {
    template : `
    <div>
    <center> <h1> DELETE SECTION </h1> </center>
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="card shadow p-4 border rounded-3 ">
        <h3 class="card-title text-center mb-4"></h3>
        <div class="form-group mb-3">
          <input v-model="del_section_id" type="text" class="form-control" placeholder="SECTION-ID" required/>
        </div>
        <button class="btn btn-primary w-100" @click="submitInfo"> Submit</button>
      </div>
    </div>
    </div>`,
    data()
    {
        return {
            del_section_id : "",
            role : "",
        };
    },

    methods:{
        async submitInfo(){
            const url = window.location.origin;
            const res = await fetch(url+'/delete_section',{
                method : 'POST',
                headers : {
                    "Content-Type":"application/json"
                },
                //this because we need to get our own
                body : JSON.stringify({del_section_id:this.del_section_id,role:sessionStorage.getItem('role')}),
            });

            
            if(res.ok)
            {
              // console.log(sessionStorage.getItem('token'));
              console.log("ok");
              const data = await res.json(); // await because it is actually the response we need that data
              // sessionStorage.setItem('token',data.token);
              sessionStorage.setItem('del_section_id',data.del_section_id);
              // sessionStorage.setItem('role',data.role);

              console.log(sessionStorage.getItem('token'));
              console.log(sessionStorage.getItem('role'));
              
              router.push("/admin_dashboard");
            }

            else{
              console.log("Delete Section Failed");
            }
        },
    },
};

export default Delete_Section;