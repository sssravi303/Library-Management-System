import StudyResource from "../components/StudyResource.js";
// import "./static/style.css";
const GetBooks = {
  template: `
<div id="main">
    <div id="canvas" >
    <table class="table" style = "width: 90%;border-collapse: collapse;text-align: justify; margin: auto;
      "v-for="i in allResource">  
        <tr>
          <th style ="background-color: lightgray; border: 1px solid black;padding: 8px;text-align: center;"> Section-ID </th>
          <th style ="background-color: lightgray;  border: 1px solid black;padding: 8px;text-align: center;"> Book-ID </th>
          <th style ="background-color: lightgray; border: 1px solid black;padding: 8px;text-align: center;"> Book-Name </th>
          <th style ="background-color: lightgray; border: 1px solid black;padding: 8px;text-align: center;"> Author </th>
          <th style ="background-color: lightgray;border: 1px solid black;padding: 8px;text-align: center;"> Amount</th>
        </tr>
          <tr v-for="book in i"> 
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
      allResource: [] ,
      role :"",
      word : ""
    };
  },
  async mounted() {
      const url = window.location.origin;
      const word = String(sessionStorage.getItem('word'));
      const res = await fetch(url + "/res_books" ,{ //to get the resouces from api
        method : 'POST',
        headers:{
          "Authentication-Token" : sessionStorage.getItem('token'),
          "Content-Type":"application/json"
        },
        body:JSON.stringify({'word' : word})
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
  // components: { StudyResource },
};

export default GetBooks;