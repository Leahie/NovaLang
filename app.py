from flask import Flask, render_template, request
from random import randint

from random import choices
app = Flask(__name__)


# FUNCTION TO GENERATE THE FORM
def process(txt):
  with open(txt, "r",encoding='utf-8') as file:
    input_lines = [line.strip() for line in file]
    lines = []
    line = ""
    for x in input_lines:
      if len(x) > 2: # getting rid of chapter/numbers, if numbers, punctuation 
        if "_" not in x:
          line = line + " " + x
      if x == "" and line != "":
        lines.append(line)
        line = ""        
    return lines

text = 'Pride_and_Prejudice_by_Jane_Austen.txt'
lines = process(text)
@app.route('/')
def home():
  num =  randint(6, 1000)
  # Word is actually a sentence, because lines is actually a lot of setences  
  word = lines[num]
  x = word.split(' ')

  inputNumbers = [i for i in range(6, len(x))]
  print(inputNumbers)
  mod = choices(inputNumbers, k=(len(x)//10)+1)
  print(mod)
  mod.sort()
  print(mod)

  # In the future all of this will be generated from the LLM 
  dic = {
    'text': x, 
    'modify-list': mod,
    'modifiers': ['magically', 'organically', 'going']
  }
  return render_template('home.html', data=dic)

app.debug = True
if __name__ == '__main__':
  app.run(host='0.0.0.0', port=80)