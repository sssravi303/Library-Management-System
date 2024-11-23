const Profile = {
    template: `<div> 
              welcome {{email}}, having role: {{role}}  with id: {{id}}
              </div>`,

        data()
        {
         return{
            email : sessionStorage.getItem("email"),
            role : sessionStorage.getItem("role"),
            id : sessionStorage.getItem("id"),
        }
    }
  };
  
  export default Profile;