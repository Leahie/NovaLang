from flask import Flask, render_template, request
from datasets import load_from_disk
from random import randint



app = Flask(__name__)

ds = load_from_disk('book-corpus')

# ROUTE TO GENERATE THE FORM
@app.route('/')
def home():
  # In the future all of this will be generated from the LLM
  num =  randint(6, 1000)
  word = ds['train']['text'][num-6:num]
  dic = {
    'text': word,
    'modify-list': [2, 8, 10, 15, 19, 20],
    'modifiers': ['magically', 'organically', 'going']
  }
  return render_template('home.html', data=dic)

app.debug = True
if __name__ == '__main__':
  app.run(host='0.0.0.0', port=80)