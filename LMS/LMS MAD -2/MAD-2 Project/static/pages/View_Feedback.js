import router from "../utils/router.js";

const Feedback_admin = {
    template : 
    `<div id="main">
    <div id="canvas" >
        <h1>These are Feedbacks from Users</h1>

        <table class="table" v-for="feed in allResource">
        <tr>
          <th> User-ID</th>
          <th> Book-ID</th>
          <th> Rating </th>
          <th> Description </th>
        </tr>
          <tr v-for="i in feed">   
            <td> {{i.user_id}} </td>
            <td> {{i.book_id}} </td>
            <td> {{i.rating}} </td>
            <td> {{i.description}} </td>
        </tr>
        </table>
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
            allResource :[]
        };
    },

    methods:{
        async submitInfo(){
            const url = window.location.origin;
            const res = await fetch(url+'/view_feedback',{
                method : 'POST',
                headers : {
                    "Content-Type":"application/json"
                },
                //this because we need to get our own
                // body : JSON.stringify({id:sessionStorage.getItem('role'),book_id:this.book_id,rating:this.rating,description:this.description,
                //   role:sessionStorage.getItem('role')}),
            });

            if(res.ok)
            {
              const data = await res.json(); // await because it is actually the response we need that data
              // sessionStorage.setItem('token',data.token);
              // sessionStorage.setItem('role',data.role);
              // sessionStorage.setItem('email',data.email);
              // sessionStorage.setItem('id',data.id);
              this.allResource = data;
              console.log(sessionStorage.getItem('email'));
              console.log(sessionStorage.getItem('role'));

            //   router.push("/user_dashboard");
            }
            else{
              console.log("Failed");
            }
        },
    },
};

export default Feedback_admin;