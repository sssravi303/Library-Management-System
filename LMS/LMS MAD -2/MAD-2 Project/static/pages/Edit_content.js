import router from "../utils/router.js";

const Edit_content = {
    template : 
    `<div class="d-flex justify-content-center align-items-center vh-100">
      <div class="card shadow p-4 border rounded-3 ">
        <h3 class="card-title text-center mb-4">EDIT CONTENT</h3>
        <div class="form-group mb-3">
          <input v-model="book_id" type="text" class="form-control" placeholder="Book ID" required/>
        </div>
        <div class="form-group mb-3">
          <input v-on="content" type="file" @change="handleFileUpload" class="form-control" placeholder="New Content" required/>
        </div>
        <button class="btn btn-primary w-100" @click="submitInfo">Submit</button>
      </div>
    </div>`,

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
        formData.append('pdf_file', this.content); 

            console.log(this.file_path)
            const res = await fetch(url+'/edit_content',{
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
              router.push("/admin_dashboard");
            }

            else{
              console.log("Book Editing Failed");
            }
        },
    },
};

export default Edit_content;  