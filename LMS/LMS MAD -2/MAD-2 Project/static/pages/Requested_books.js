import Req_display from "../components/Request_display.js";

const Req_Books = {
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
              <td> <button class="btn btn-primary" v-if="request.status === 'granted'" @click="PayPortal(request.user_id,request.bookid)"> PayNow </button>
               <button class="btn btn-primary" v-if="request.status === 'available'" @click="PayPortal(request.user_id,request.bookid)"> Download </button>
              <span v-if="request.status === 'revoked'">  Revoked </span>
              <span v-if="request.status === 'deleted'">  Deleted </span>
              </td>
            </tr>
            </table>
        </div>
        </div>
    </div>
</div>`,

  data() {
    return {
      allResource: [],
      id:""
    };
  },

  methods :
  {
    async PayPortal(user_id,book_id)
    {
      console.log(user_id,book_id)
      const url = window.location.origin;
      const res = await fetch(url + "/download_pdf/"+ user_id +"/"+book_id,{
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const blob = await res.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'req_book.pdf';
        document.body.appendChild(a);
        a.click();  // Programmatically trigger a click to start the download
        a.remove();  // Clean up
        window.URL.revokeObjectURL(downloadUrl);  // Release the Blob URL
      } 
      else {
        console.error('Failed to download the book:', res.statusText);
      }
    }
  },
  async mounted() {
    const url = window.location.origin;
    const id = String(sessionStorage.getItem('id'));
    const res = await fetch(url+"/requested_books/" + id, {
      headers: {
              "Content-Type":"application/json",
        "Authentication-Token": sessionStorage.getItem('token')
      },
    });
    
    if (res.ok) {
      const data = await res.json();
      
      this.allResource = data;
    } else {
      console.log('Error fetching resources');
    }
  },
  components: { Req_display },
};

export default Req_Books;
