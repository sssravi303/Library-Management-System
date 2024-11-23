const Check_Req_display = {
    template: 
    `   <tr >
        <td> {{user_id}} </td>
        <td> {{bookid}} </td>
        <td> {{book_name}} </td>
        <td> {{requested_date}} </td>
        <td> {{granted_date}} </td>
        <td> {{return_date}} </td>
        <td> {{status}} </td>
        <td><button @click="grantrequest(user_id)"> Grant </button></td>
        </tr>
        `, 

    props: {

      id :{
        type: String,
      },
      user_id: {
        type: Number,
      },  
      bookid: {
        type: String,
      },
      book_name: {
        type: String,
      },
      requested_date : {
        type:String
      },
      granted_date : {
        type:String
      },
      return_date : {
        type:String
      },
      status : {
        type:String
      },
    },
    data() {
      return {
        showPopup: false,
      };
    },

    
    methods: {
      grantrequest() {
          
      },
      closePopup() {
        this.showPopup = false;
      },
      async sendApproval() {
        // send fetch request to approval backend
        console.log("sending Approval");
      },

    },


    mounted() {
      const style = document.createElement("style");
      style.textContent = `
        .study-resource-card {
          max-width: 600px;
          margin: auto;
          border-radius: 15px;
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .study-resource-card:hover {
          transform: scale(1.02);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }
      `;
      document.head.appendChild(style);
    },
  };
  
  export default Check_Req_display;