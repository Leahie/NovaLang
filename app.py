from flask import Flask, render_template, request
from random import randint
app = Flask(__name__)


# ROUTE TO GENERATE THE FORM
def process(txt):
  with open(txt, "r",encoding='utf-8') as file:
      input_lines = [line.strip() for line in file]
      lines = []
      line = ""
      for x in input_lines:
          if len(x) > 2:
              lines.append(line)
              line = ""
          if x != "":
                  line += x
        
      return lines

text = 'Pride_and_Prejudice_by_Jane_Austen.txt'
lines = process(text)
@app.route('/')
def home():
  num =  randint(6, 1000)
  word = lines[num]
  # In the future all of this will be generated from the LLM 
  dic = {
    'text': word, 
    'modify-list': [2, 8, 10, 15, 19, 20],
    'modifiers': ['magically', 'organically', 'going']
  }
  return render_template('home.html', data=dic)

app.debug = True
if __name__ == '__main__':
  app.run(host='0.0.0.0', port=80)