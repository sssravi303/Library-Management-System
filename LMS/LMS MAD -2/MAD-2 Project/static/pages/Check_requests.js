
// import Check_Req_display from "../components/Check_req_display.js";
import router from "../utils/router.js";

const Check_Req = {
  template: `
<div id="main">
    <div id="canvas">
        <h1>These are requested books</h1>
          <table class="table" v-for="i in allResource">  
            <tr>
              <th> User-ID </th>
              <th> Book-ID </th>
              <th> Book-Name </th>
              <th> Requested Date </th>
              <th> Granted Date </th>
              <th> Return Date </th>
              <th> Status </th>
              <th> Option </th>
            </tr>


            <tr v-for="request in i"> 
              <td> {{request.user_id}} </td>
              <td> {{request.bookid}} </td>
              <td> {{request.book_name}} </td>
              <td> {{request.requested_date}} </td>
              <td> {{request.granted_date}} </td>
              <td> {{request.return_date}} </td>
              <td> {{request.status}} </td>
              <td> <button class="btn btn-success" v-if="request.status === 'requested'" @click="GrantRequest(request.user_id,request.bookid)"> Grant </button>
               <button class="btn btn-danger" v-if="request.status === 'requested'" @click="CancelRequest(request.user_id,request.bookid)"> Cancel </button>
               <button class="btn btn-warning" v-if="request.status === 'granted'" @click="RevokeRequest(request.user_id,request.bookid)"> Revoke </button>
              <button class="btn btn-warning" v-if="request.status === 'available'" @click="RevokeRequest(request.user_id,request.bookid)"> Revoke </button>
              <span v-if="request.status === 'revoked'">  Revoked </span>
              <span v-if="request.status === 'deleted'">  Deleted </span>
              </td>
          </tr>
  
        </table>

    </div>
</div>


`,

  data() {
    return {
      allResource: [],
      user_id:""
    };
  },

  methods :
  {
  async GrantRequest(user_id,bookid){
     console.log(user_id,bookid)
      const url = window.location.origin;

      // this.$store.commit('setUserId',user_id);
      // this.$store.commit('setBookId'.bookid);

      sessionStorage.setItem('user_id',user_id)
      sessionStorage.setItem('bookid',bookid)

      // u_id = String(user_id)
      const res = await fetch(url + "/grant_request/"+user_id+"/"+bookid,{
        headers: {
          "Authentication-Token": sessionStorage.getItem('token')
        },
      });
      // router.push("/check_requests");
    },
  async CancelRequest(user_id,bookid){
      console.log(user_id,bookid)
      const url = window.location.origin;
 
       // this.$store.commit('setUserId',user_id);
       // this.$store.commit('setBookId'.bookid);
 
       sessionStorage.setItem('user_id',user_id)
       sessionStorage.setItem('bookid',bookid)
 
       // u_id = String(user_id)
       const res = await fetch(url + "/cancel_request/"+user_id+"/"+bookid,{
         headers: {
           "Authentication-Token": sessionStorage.getItem('token')
         },
       });
      //  router.push("/check_requests");
     },


  async RevokeRequest(user_id,bookid){
    console.log(user_id,bookid)
     const url = window.location.origin;

     // this.$store.commit('setUserId',user_id);
     // this.$store.commit('setBookId'.bookid);

     sessionStorage.setItem('user_id',user_id)
     sessionStorage.setItem('bookid',bookid)

     // u_id = String(user_id)
     const res = await fetch(url + "/revoke_request/"+user_id+"/"+bookid,{
       headers: {
         "Authentication-Token": sessionStorage.getItem('token')
       },
     });
    //  router.push("/check_requests");
   },
  },
  async mounted() {
    const url = window.location.origin;
    const res = await fetch(url+"/check_requests", {
      headers: {

        "Authentication-Token": sessionStorage.getItem('token')
      },
    });
    
    if (res.ok) {
      const data = await res.json();
      
      this.allResource = data;
    } 
    else {
      console.log('Error fetching resources');
    }
  },
  // components: { Check_Req_display },
};

export default Check_Req;
// "Content-Type":"application/json",