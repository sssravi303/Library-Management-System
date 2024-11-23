const Req_display = {
    template: 
    `<div id="main">
    <div id="canvas">
      <table class="table">
        <td> {{user_id}} </td>
        <td> {{bookid}} </td>
        <td> {{book_name}} </td>
        <td> {{requested_date}} </td>
        <td> {{granted_date}} </td>
        <td> {{return_date}} </td>
        <td> {{status}} </td>
        </tr>
      </table> 
      </div>
      </div>`, 

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
      openPopup() {
        this.showPopup = false;
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
  
  export default Req_display;