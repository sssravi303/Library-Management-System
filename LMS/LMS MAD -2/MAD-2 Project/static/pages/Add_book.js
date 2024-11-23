import router from "../utils/router.js";

const Add_book = {
    template : 
    `
<div class="d-flex justify-content-center align-items-center vh-100">
      <div class="card shadow p-4 border rounded-3 ">
        <h3 class="card-title text-center mb-4">ADD BOOK</h3>
        <br>
        <h3> Note: The 1st character should be  SECTION-ID and next two characters of BOOK-ID should be acronym of the particluar section name (viz PH,CS) and last two characters should be numbers <br> Amount should be Positive Integer</h3>
        <div class="form-group mb-3">
          <input v-model="book_id" type="text" class="form-control" placeholder="Book ID" required/>
        </div>

        <div class="form-group mb-4">
          <input v-model="book_name" type="text" class="form-control" placeholder="Book Name" required/>
        </div>

        <div class="form-group mb-3">
          <input v-model="author" type="text" class="form-control" placeholder="Author" required/>
        </div>

        <div class="form-group mb-3">
          <input v-model="section_id" type="text" class="form-control" placeholder="Section ID" required/>
        </div>

        <div class="form-group mb-3">
          <input v-model="amount" type="text" class="form-control" placeholder="Amount" required/>
        </div>

        <div class="form-group mb-3">
          <input v-on="content" type="file" @change="handleFileUpload" class="form-control" placeholder="Content" required/>
        </div>

        <button class="btn btn-primary w-100" @click="submitInfo">Submit</button>
      </div>
    </div>
    `,
    data()
    {
        return {  
            book_id : "",
            book_name : "",
            author : "",
            section_id : "",
            content : null,
            amount : "",
            file_name : "",
            file : "",
            role:"",
        };
    },

    methods:{
      handleFileUpload(event) {
        this.content = event.target.files[0];  // Store the selected file

        // Optionally, store the file path if you want the full path or file name
        this.file_path = event.target.value;   // This will give you the path or filename depending on the browser
    },
    async submitInfo() {
        const url = window.location.origin;

        const formData = new FormData();
        formData.append('book_id', this.book_id);
        formData.append('book_name', this.book_name);
        formData.append('author_name', this.author);
        formData.append('sec_id', this.section_id);
        formData.append('amount', this.amount);
        formData.append('pdf_file', this.content); 


            console.log(this.file_path)
            const res = await fetch(url+'/add_book',{
                method : 'POST',
                body : formData
                //this because we need to get our own

            });

            if(res.ok)
            {
              const data = await res.json(); // await because it is actually the response we need that data
              console.log("Here are email and token");
              // console.log(sessionStorage.getItem('email'));
              // console.log(sessionStorage.getItem('role'));
              if (this.$route.path !== '/admin_dashboard') {
                router.push('/admin_dashboard');
            }
            
            }

            else{
              console.log("Book Upload Failed");
            }
        },
    },
};

export default Add_book;  