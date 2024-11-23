import router from "../utils/router.js";

const Search_word = {
    template : 
    `<div class="d-flex justify-content-center align-items-center vh-100">
      <div class="card shadow p-4 border rounded-3 ">
        <h3 class="card-title text-center mb-4">Search by Book-ID/Author/Bookname</h3>
        <div class="form-group mb-3">
          <input v-model="word" type="text" class="form-control" placeholder="BookID/Author/Bookname" required/>
        </div>
        <button class="btn btn-primary w-100" @click="submitInfo">Submit</button>
      </div>
        </div>
        `,

    data()
    {
        return {  
            book_id : "",
            author_name : "",
            description : "",
            role :"",
            word :""
        };
    },
    methods :{
    async submitInfo(){
            const url = window.location.origin;
            const res = await fetch(url+'/search_books',{
                method : 'POST',
                headers : {
                    "Content-Type":"application/json"
                },
                //this because we need to get our own
                body : JSON.stringify({word:this.word,
                  role:sessionStorage.getItem('role')}),
            });

            if(res.ok)
            {
              const data = await res.json(); // await because it is actually the response we need that data
              sessionStorage.setItem('word',this.word);
              this.$store.commit('setword',data.word);

              console.log(sessionStorage.getItem('email'));
              console.log(sessionStorage.getItem('role'));
              console.log(sessionStorage.getItem('word'));

              router.push("/res_books");
            }
            else{
              console.log("Editing Author Failed");
            }
        },
    },
}

export default Search_word;