from flask import render_template_string,render_template,request,Flask,jsonify,redirect,send_file
from flask_security import auth_required,roles_required
from flask_security import SQLAlchemySessionUserDatastore
from flask_security.utils import hash_password,verify_password
from models import db,Book,Section,User,Requests,Feedback
from datetime import datetime,timedelta
from io import BytesIO
from tasks import export_job
from celery.result import AsyncResult
import matplotlib.pyplot as plt
import matplotlib 
matplotlib.use("Agg") 


word = ""
def create_views(app : Flask, user_datastore : SQLAlchemySessionUserDatastore,cache):
    # celery demo
    # @app.route('/celerydemo')
    # def celery_demo():
    #     task = add.delay(20,30)
    #     return jsonify({'task_id' : task.id}) 
    

    
    @app.route('/start_export')
    def start_export():
        task = export_job.delay()
        return jsonify({'task_id' : task.id})
    
    @app.route('/get_task/<task_id>')
    def get_task(task_id):
        result = AsyncResult(task_id) #result object
        
        if result.ready(): #gives true if the task is completed
            return send_file('./user_downloads/file.csv')
        else:
            "task not ready",405
    
    @app.route('/')
    def home():
        return render_template('index.html')
    
    @app.route('/user-login',methods = ['POST'])
    @cache.cached(timeout = 10)
    def user_login():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        print(email)
    
        if not email:
            return jsonify({"message" : "not valid email or password"}),404
        # user = user_datastore.find_user(email=email)
        user = User.query.filter_by(email = email).first()
        user_1 = User.query.filter_by(id = user.id).first()
        
        if not user_1:
            return jsonify({"message" : "not valid email or password"}),404
        
        if verify_password(password, user.password):
            # global global_user_id = user_1.id
            return jsonify({'token' : user.get_auth_token() , 'role' : user.roles[0].name, 'id' : user.id ,'email' : user.email }),200
            
        else:
            return jsonify({"message" : "Wrong password"}),render_template_string("Invalid Username or Password")

    @auth_required("token")
    @app.route('/profile',methods = ['GET'])
    def profile():
        return render_template_string("""                
        <h1> This is profile page
        <p> Welcome {{current_user.email}}
        <a href="/logout"> Logout </a>
        """)

    @app.route("/register",methods=['POST'])
    def register():
        data = request.get_json()
        
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')
        
        if not email and not password and role in ['user']:
            return jsonify({'message': 'inavaid input'}),403
        
        if user_datastore.find_user(email=email):
            return jsonify({'message': 'user already exists'}),400
         
        if role == 'user':
            active = True
            try:
                user_datastore.create_user(email=email,password = hash_password(password),active = True, roles = ['user']),201
                db.session.commit()
            except:
                print('error while creating')
                db.session.rollback()
                return jsonify({'message' : 'error while creating the user'}),408
            return jsonify({'message' : 'User Creation Success'}),200
    @app.route('/feedback',methods=['GET','POST']) #feedback form page
    def feedback():
        data = request.get_json()
        user_id=data.get("user_id")
        bookid=data.get("book_id")
        rating=data.get("rating")
        des=data.get("description")
        print(user_id,rating)
        feed=Feedback(user_id=int(user_id),book_id=bookid,rating=int(rating),description=des)
        if feed:
            db.session.add(feed)
            db.session.commit()
            return jsonify({'message' : 'Feedback submitted successfully'}),200
        return jsonify({'message' : 'Feedback submission failed'}),400
    def seralize_feed(feed):
        return {
            'user_id':feed.user_id,
            'book_id':feed.book_id,
            'rating':feed.rating,
            'description' : feed.description}
    @app.route('/view_feedback',methods=['GET','POST']) #viewing the feedback form admin
    def view():
        feeds=Feedback.query.all()
        print("ok")
        
        if feeds:
            feeds_list=[]
            for i in feeds:
                feeds_list.append(seralize_feed(i))
            print(feeds)
            return jsonify({'feedbacks' : feeds_list}),200
        return jsonify({'message' : 'Feedback fetch failed'}),400
    
    @app.route('/request_book',methods=['GET','POST'])
    def req():
        data = request.get_json()
        # data = data.get('req_book_id')
        email = data.get('email')
        req_book_id = data.get('req_book_id')
        user = user_datastore.find_user(email=email)
        # user_2 = user_datastore.find_user(id=id)
        book = Book.query.filter_by(book_id = data.get('req_book_id')).first()
        user_info = User.query.filter_by(email=email).first()
        user_id = user_info.id 
        request_if_any = Requests.query.filter_by(user_id=user_id,bookid = req_book_id).all()
        
        if request_if_any:  #if the user has already requested the book
            return jsonify({'message' : 'You have already requested this book'}),400
        
        if user_info and book:
            if user_info.no_of_books_owned<5:
                requests = Requests(bookid = req_book_id, book_name = book.book_name,requested_date = datetime.now().strftime("%Y-%m-%d"),granted_date = "To be granted",
                                return_date = "To be updated", status = "requested",section_id = book.section_id,user_id = user_info.id)
                db.session.add(requests)
                user_info.no_of_books_owned +=1
                db.session.commit()
            else:
                return jsonify({'message' : "Already requested 5 books"}),400
                
        else: 
            return jsonify({'message' : 'Error,Problem with User or Book'}),400
            
        return jsonify({'message' : 'request sent'}),200
    
    @app.route('/revoke_request/<int:user_id>/<string:bookid>/',methods=['GET','POST']) 
    def revoke_request(user_id,bookid):    #function to revoke the granted or the paid books
        req1=Requests.query.filter_by(user_id=user_id,bookid=bookid,status="granted").all()
        req2=Requests.query.filter_by(user_id=user_id,bookid=bookid,status="available").all()
        req=req1+req2
        if req:
            for i in req:
                if i: 
                    i.status="revoked" #changes the status
                    db.session.commit()  #commit the operation into the database
            return jsonify({"message" : "revoked request"}),200
        return jsonify({"message" : "no request found"}),400
    @app.route('/download_pdf/<int:user_id>/<string:book_id>',methods=['GET','POST']) #downloading a book 
    def download(user_id,book_id):
        book_download = Book.query.filter_by(book_id=book_id).first()
        print(user_id)
        req_1=Requests.query.filter_by(user_id=user_id,bookid=book_id,status ="granted").all()
        req_2=Requests.query.filter_by(user_id=user_id,bookid=book_id,status ="available").all()
        user=User.query.filter_by(id=user_id).first()
        req=req_1+req_2
        print(req)
        if req[0].status=="available": #if already paid just download
            return send_file(BytesIO(book_download.content), download_name=book_download.file_name,as_attachment=True)
        elif req and user.wallet_amount> book_download.amount and book_download:
            req[0].status="available" #if not paid pay and download
            user.wallet_amount=user.wallet_amount-book_download.amount
            db.session.commit()
            return send_file(BytesIO(book_download.content), download_name=book_download.file_name,as_attachment=True)
        # else:
        #     return redirect(f'/wallet/{user_id}') #if insufficient money then add amount to wallet
    @app.route('/grant_request/<int:user_id>/<string:bookid>/',methods=['GET','POST'])
    def grant_request(user_id,bookid):
        stu_obj=Requests.query.filter_by(user_id=user_id,bookid=bookid,status="requested").first() #grant the books for the defined period of time
        if stu_obj:
            stu_obj.status="granted"
            granted_days = 7 # granted time is 7 days
            present_date = datetime.now()
            stu_obj.granted_date=present_date.strftime("%Y-%m-%d")
            # i.granted_date=present_date
            next_date = present_date + timedelta(days=granted_days)
            return_date = next_date.strftime("%Y-%m-%d") #converting into YYYY-MM-DD format
            stu_obj.return_date=return_date
            db.session.commit()
            return jsonify({"message" : "granted request"}),200
        
        return jsonify({"message" : "no request found"}),400
    @app.route('/cancel_request/<int:user_id>/<string:bookid>/',methods=['GET','POST'])
    def cancel_request(user_id,bookid): #cancel a request 
        req=Requests.query.filter_by(user_id=user_id,bookid=bookid,status="requested").first()
        if req:
            req.status="cancelled" #changes the status 
            req.granted_date="None" 
            req.return_date="None"
            db.session.commit()
            return jsonify({"message" : "canceled request"}),200
        return jsonify({"message" : "no request found"}),400
    def serialize_object(user_req):
        return {
            "user_id" : user_req.user_id,
            "bookid" : user_req.bookid,
            "book_name" : user_req.book_name, 
            "requested_date" : user_req.requested_date,
            "granted_date" : user_req.granted_date ,
            "return_date" : user_req.return_date,
            "status" : user_req.status
          }
    @app.route('/check_requests', methods =['GET','POST'])
    def check_req():
        # data = request.get_json()
        # user_id = int(data.get('id'))
        requested_books = Requests.query.all()
        json_books = []
        for req in requested_books:
            json_books.append(serialize_object(req))
        print(json_books)
        return jsonify({'requested_books' : json_books}),200
    
    @app.route('/requested_books/<string:id>',methods =['GET','POST'])
    def req_books(id):
        # data = request.get_json()
        print(id)
        # user_id = int(data.get('id'))
        requested_books = Requests.query.filter_by(user_id = int(id)).all()
        json_books = []
        for req in requested_books:
            json_books.append(serialize_object(req))
        print(json_books)
        return jsonify({'requested_books' : json_books}),200
    
    @app.route('/delete_book', methods=['GET','POST'])
    # @roles_required('admin')
    def delete():
        data = request.get_json()
        book_id = data.get('del_book_id')
        book = Book.query.filter_by(book_id = data.get('del_book_id')).first()
        requests = Requests.query.filter_by(bookid = book_id).all()
        if book:
            if requests:
                for req in requests:
                    req.status = "deleted"
                    user = User.query.filter_by(id=req.user_id).first()
                    if user:
                        user.no_of_books_owned = user.no_of_books_owned - 1
            db.session.delete(book)
            db.session.commit()
        return jsonify({'message' : 'request sent'}),200

    @app.route('/delete_section', methods=['GET','POST'])
    def delete_section():
        data = request.get_json()
        section_id = int(data.get('del_section_id'))
        section = Section.query.filter_by(section_id = section_id).first()
        if section:
            requests = Requests.query.filter_by(section_id = section_id).all()
            if requests:
                for req in requests:
                    req.status = "deleted"
                    user = User.query.filter_by(id=req.user_id).first()
                    if user:
                        user.no_of_books_owned = user.no_of_books_owned - 1
            db.session.delete(section)
            db.session.commit()
        else:
            return jsonify({'message' : 'The section does not exist'}),400
            
        return jsonify({'message' : 'request sent'}),200    

    @app.route('/add_book', methods=['GET','POST'])
    def add_book():
        # data = request.form.get('book_id')
        book_id=request.form.get('book_id') 
        book_name=request.form.get('book_name')
        author=request.form.get('author_name')
        section_id=request.form.get('sec_id')
        amount=request.form.get('amount')
        file= request.files.get('pdf_file')
        print(amount,section_id,file)
        book = Book(book_id = book_id,book_name = book_name ,author = author,
                    section_id = section_id,amount=amount,
                    content = file.read(),file_name = file.filename)
        
        section = Section.query.filter_by(section_id = section_id).first()
        if section:
            if int(book_id[0]) == int(section_id):
                db.session.add(book)
                db.session.commit()
            else: 
                return jsonify({'message' : 'Invalid Book ID or Section ID'}),400
        else:
            return jsonify({'message' : 'The section does not exist'}),400
        return jsonify({'message' : 'book created'}),200

    @app.route('/add_section', methods=['GET','POST'])
    def add_section(): 
        data = request.get_json()
        date = datetime.now()
        section = Section(section_id = data.get('section_id'),section_name = data.get('section_name'),created_on = date,description = data.get('description'))
        db.session.add(section)
        db.session.commit()
        return jsonify({'message' : 'book created'}),200
    
    @app.route('/edit_author',methods=['GET','POST'])
    def edit_auth():
        data = request.get_json()
        book_id=data.get('book_id')
        edit_name=data.get("author_name")
        book=Book.query.filter_by(book_id=book_id).first() #Get the book and edit it
        if book and data: 
            book.author=edit_name #edit the book content
            db.session.commit()
            return jsonify({'message' : 'author name edited'}),200
        else:
            return jsonify({'message' : 'error in editing'}),400
        
    @app.route('/edit_content',methods=['GET','POST'])
    def edit_content():
        book_id=request.form.get('book_id')
        file= request.files.get('pdf_file')
        print(file)
        book=Book.query.filter_by(book_id=book_id).first() #Get the book and edit it
        if book:
            book.content=file.read()
            book.file_name=file.filename #edit the book content
            db.session.commit() 
            return jsonify({'message' : 'Book content edited'}),200
        else:
            return jsonify({'message' : 'error in editing'}),400
    @app.route('/stats') #for the pie chart,bar graph and the stats
    def stats():
        books=Book.query.all()
        req=Requests.query.all()
        section=Section.query.all()
        l_book=[]
        for i in books:
            l_book.append(i.section.section_name)
            
        plt.clf()
        plt.hist(l_book)#for bar graph
        plt.title('Summary Of Distribution Of Books')  
        plt.ylabel('Number Of Books',fontsize=10,labelpad=7)
        plt.xlabel('Books',fontsize=10,labelpad=7)
        plt.savefig('static/img-stats-1.png')
        s=set(l_book)
        l=list(s)
        l_pie=[]
        plt.clf()       
        for i in l:
            l_pie.append(l.count(i))
        plt.title('Summary Of Distribution Of Books in Pie')
        plt.pie(l_pie,labels=l)
        plt.savefig('static/img-stats-2.png')
        
        l_req=[]
        for i in req:
            l_req.append(i.book_name)
        freq=[]
        l=list(set(l_req))
        for i in l:
            freq.append(l_req.count(i))
        plt.clf()

        plt.title('Summary Of Distribution Of Book Requests in Pie') #for the request frequency distributed in pie chart
        plt.pie(freq,labels=l)  
        
        plt.savefig('static/img-stats-3.png') #saving image in static folder
        return jsonify({'message' : 'stats_created'}),200
    
    def book_json(req):
        return {
            "section_id" : req.section_id,
            "book_id" : req.book_id,
            "book_name" : req.book_name, 
            "author" : req.author,
            "amount" : req.amount,
            }
    
    
    @app.route('/search_books',methods =['GET','POST'])
    def ser_word():
        data = request.get_json()
        if data.get('word'):
            print(data.get('word'))
            return jsonify({'message' : 'successful'}),200
        return jsonify({'message' : 'unsuccessful'}),400
    def raw_text(word): #to give a raw text with no spaces in between
        list_of_words=word.split() 
        words=''
        for i in list_of_words:
            words+=i
        return words
    @app.route('/res_books',methods= ['GET','POST'])#search book
    def search_admin():
        data = request.get_json()
        word = data.get('word')
        print(word)
        sr_word=(word).strip()
        sr_new_word="%"+raw_text(sr_word)+"%"
        sr="%"+sr_word+"%"
        book_1=Book.query.filter(Book.book_name.like(sr_new_word)).all()
        book_2=Book.query.filter(Book.book_id.like(sr_new_word)).all()
        book_3=Book.query.filter(Book.author.like(sr)).all()
        book_4=Book.query.filter(Book.section_id.like(sr_new_word)).all()        
        book_5=Book.query.filter(Book.book_name.like(sr)).all()
        # if sr_word.isnumeric():
        book_6=Book.query.filter(Book.amount.like((sr_new_word))).all()
        result=book_1+book_2+book_3+book_4+book_5+book_6
        new_result=[]
        for i in result: #to filter the empty list
            if i:
                new_result.append(i)
        s=set(new_result)
        new_result=list(s)
        send_res =[]
        if new_result:
            for i in new_result:
                print(i.section_id)
                send_res.append(book_json(i))
            print(send_res)
            return jsonify({'send_books' : send_res}),200
        else: 
            return jsonify({'message' : 'no books found'}),200
    @app.route('/edit_profile',methods = ['GET','POST'])
    def edit_profile():
        data = request.get_json()
        old_email = data.get('old_email')
        user = User.query.filter_by(email = old_email).first()
        if user:
            new_email = data.get('new_email')
            if '@' in new_email:
                user.email = new_email
                db.session.commit()
                return jsonify({'message':'successful'}),200
            else:
                return jsonify({'message' : 'Enter new valid email'})
        else:
            return jsonify({'message' : 'email does not exist'}),400
    
# a - href login --> backend login
# router-link login --> frontend login

