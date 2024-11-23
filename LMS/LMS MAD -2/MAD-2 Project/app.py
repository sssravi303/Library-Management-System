from flask import Flask
from models import db
from ext import secur,cache
from create_initial_data import create_data
import views
import resources
from worker import celery_init_app
import flask_excel as excel
from tasks import daily_reminder
from celery.schedules import crontab   
from models import User,Requests
# from flask_caching import Cache
celery_app =None

app = Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///my_proj_2_db.sqlite3"
app.config['SECRET_KEY'] = "shoud-not-be-seen"
app.config['SECURITY_PASSWORD_SALT'] = "salty-password"

#For to let tokens expire after some time   
app.config['SECURITY_TOKEN_AUTHENTICATION_HEADER']= 'Authentication-Token'
app.config['SECURITY_TOKEN_MAX_AGE']= 3600
app.config['SECURITY_LOGIN_WITHOUT_CONFIRMATION']=True
# app.config['UPLOAD_FOLDER'] = 'uploads/'

app.config['CACHE_TYPE']= "RedisCache"
app.config['CACHE_DEFAULT_TIMEOUT']= 3000
app.config['DEBUG']=True
app.config['CACHE_REDIS_PORT']= 6379

cache.init_app(app) #Initialising contructer in extensions and using here
db.init_app(app)
celery_app = celery_init_app(app) #gives the celery instance for the flask app
excel.init_excel(app)      
app.app_context().push()

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # Calls test('hello') every 10 seconds.
    # sender.add_periodic_task(10, daily_reminder.s('test@gmail','Testing','<h2> connect here </h2>'), name='add every 10')

    # # Calls test('hello') every 30 seconds.
    # # It uses the same signature of previous task, an explicit name is
    # # defined to avoid this task replacing the previous one defined.
    # sender.add_periodic_task(30.0, test.s('hello'), name='add every 30')

    # # Calls test('world') every 30 seconds
    # sender.add_periodic_task(30.0, test.s('world'), expires=10)

    # Executes every Monday morning at 7:30 a.m.
    
    req_1 = Requests.query.filter_by(status = "granted").all()
    req_2 = Requests.query.filter_by(status = "available").all()
    reqs = req_1+req_2
    for req in reqs:
        user = User.query.filter_by(id=req.user_id).first()
        sender.add_periodic_task(
            crontab(hour=16, minute=40, day_of_week=1),
            daily_reminder.s(user.email,'from crontab','Its long time you visted LMS, have a look at new releases'))


with app.app_context():
    from models import User,Role
    from flask_security import SQLAlchemyUserDatastore
    
    user_datastore = SQLAlchemyUserDatastore(db, User,Role)
    secur.init_app(app,user_datastore)
    
    db.create_all()
    
    create_data(user_datastore)
    
views.create_views(app,user_datastore,cache)

resources.api.init_app(app)

if __name__ == "__main__":

    app.run(debug=True)