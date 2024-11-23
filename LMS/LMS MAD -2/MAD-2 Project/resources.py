from flask_restful import Resource,Api,fields,reqparse,marshal_with
from flask_security import auth_required
from ext import cache
from models import Book,db


api = Api (prefix='/api')

parser = reqparse.RequestParser()


parser.add_argument('id',type=int)
parser.add_argument('book_name',type=str)
parser.add_argument('book_id',type=str)
parser.add_argument('author',type=str)
parser.add_argument('section_id',type=int)
parser.add_argument('content',type=str)
parser.add_argument('amount',type=int)
parser.add_argument('file_name',type=str)

book_fields = {
    'book_name' : fields.String,
    'book_id': fields.String,
    'author' : fields.String,
    'section_id' : fields.Integer,
    'content': fields.String,
    'amount': fields.Integer,
    'file_name': fields.String, 
}

class Book_materials(Resource):
    @auth_required('token')
    # @cache.cached(timeout = 50)    
    @marshal_with(book_fields)
    
    def get(self):
        all_resources=Book.query.all()
        return all_resources
    
    def post(self):
        args = parser.parse_args()
        print( args)
        book_materials = Book(book_name=args.book_name,book_id = args.book_id,author = args.author,
                              section_id = args.section_id,content= args.content,amount= args.amount,file_name= args.file_name
                              ) #puts it as dictionary if args is not in the format
        db.session.add(book_materials) 
        db.session.commit()
        return {"message" : "resources created"}, 200

api.add_resource(Book_materials, '/resources/admin')
