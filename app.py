from flask import Flask, render_template, request
app = Flask(__name__)


# ROUTE TO GENERATE THE FORM
@app.route('/')
def home():
  return render_template('home.html')

app.debug = True
if __name__ == '__main__':
  app.run(host='0.0.0.0', port=80)