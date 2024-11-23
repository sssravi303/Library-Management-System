import StudyResource from "../components/StudyResource.js";

const DashBoardStud = {
  template: `
<div id="main">
    <div id="canvas">
      <table class="table" style = "width: 90%;border-collapse: collapse;
        text-align: justify;
        margin: auto;">
        <tr>
          <th style ="background-color: lightgray; border: 1px solid black;padding: 8px;text-align: center;"> Section-ID</th>
          <th style ="background-color: lightgray; border: 1px solid black;padding: 8px;text-align: center;"> Book-ID </th>
          <th style ="background-color: lightgray; border: 1px solid black;padding: 8px;text-align: center;"> Book-Name </th>
          <th style ="background-color: lightgray; border: 1px solid black;padding: 8px;text-align: center;"> Author </th>
          <th style ="background-color: lightgray; border: 1px solid black;padding: 8px;text-align: center;"> Amount</th>
        </tr>
        
          <tr v-for="book in allResource">   
            <td style="border: 1px solid black; padding: 8px;text-align: center;"> {{book.section_id}} </td>
            <td style="border: 1px solid black; padding: 8px;text-align: center;"> {{book.book_id}} </td>
            <td style="border: 1px solid black; padding: 8px;text-align: center;"> {{book.book_name}} </td>
            <td style="border: 1px solid black; padding: 8px;text-align: center;"> {{book.author}} </td>
            <td style="border: 1px solid black; padding: 8px;text-align: center;"> {{book.amount}} </td>
        </tr>
        </table>
        </div>
    </div>
    ` ,

  data() {
    return {
      allResource: [],
    };
  },

  async mounted() {
      const url = window.location.origin;
      const res = await fetch(url + "/api/resources/admin",{
        headers:{
          "Authentication-Token" : sessionStorage.getItem('token')
        }
      }); 

      if (res.ok)
      {
        
        console.log(sessionStorage.getItem('token'));
        const data = await res.json();
        this.allResource = data;
      } 
      else {
        // Handle error responses
        console.log('Error fetching resources:');
      }
  },
  components: { StudyResource },
};

export default DashBoardStud;