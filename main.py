from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_restful import Api, Resource, abort, fields, marshal_with
from flask_sqlalchemy import SQLAlchemy, Model

from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "Prakash Presidio Project"
app.config['TEMPLATES_AUTO_RELOAD'] = True

api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
db = SQLAlchemy(app)



@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug = True, port = 5000)