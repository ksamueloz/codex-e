import re
from flask import Flask, render_template, request, make_response, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')



@app.route('/', methods = ['POST', 'GET'])
def password():
    password = request.form['textpassword']
    pattern = re.compile("^[A-Z]{1}[0-9]{3}[a-z]+[\W]{3}$")
    validate = pattern.match(password)
    if (validate is not None):
        return make_response(jsonify('Segura'), 200)
    else:
        return make_response(jsonify('Insegura'), 404)

@app.route('/juego')
def juego():
    return render_template('/juego.html')

@app.route('/about')
def about():
    return render_template('/about.html')

if __name__ == '__main__':
    app.run(debug=True)