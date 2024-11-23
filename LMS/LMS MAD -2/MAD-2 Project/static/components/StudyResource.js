const StudyResource = {
    template: 
    `<div id="main">
    <div id="canavas">
      <table class="table">
          <td> {{section_id}} </td>
          <td> {{book_id}} </td>
          <td> {{book_name}} </td>
          <td> {{author}} </td>
          <td> {{amount}} </td>
        </tr>
      </table> 
      </div>
      </div>`, 

    props: {
      id : {
        type:Number
      },
      book_id: {
        type: String,
      },  
      content: {
        type: String,
      },
      author: {
        type: String,
        // required:true,
      },  
      book_name: {
        type: String,
      },

      amount : {
        type:Number,
      },
      section_id : {
        type:Number
      },

      file_anme : {
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
  
  export default StudyResource;