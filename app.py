from flask import Flask, render_template, request
from random import randint

from random import choices
app = Flask(__name__)


# ROUTE TO GENERATE THE FORM
def process(txt):
  with open(txt, "r",encoding='utf-8') as file:
    input_lines = [line.strip() for line in file]
    lines = []
    line = ""
    for x in input_lines:
      if len(x) > 2:
        line = line + " " + x
      if x == "" and line != "":
        lines.append(line)
        line = ""        
    return lines

text = 'Pride_and_Prejudice_by_Jane_Austen.txt'
lines = process(text)

@app.route('/')
def home():

  # !NOTE: @LEAH -- In the future all of this will be generated from the LLM 
  # {{{

  num =  randint(6, 1000) #randomly selects an index corresponding to a sentence from the text
  word = lines[num] # Word is actually a sentence, because lines is actually a lot of setences  
  x = word.split(' ') #makes the sentence into an array, with each element being split by a space
  print("x:", x)
  
  # !CHECK: @LEAH --> not exactly sure if numBlanks is actually the number of blanks; double check porfa
  numBlanks = 6 #how many blanks there will be
  if len(x) < 6: #if the sentence chosen is shorter than 6 words, the number of blanks will be 1 less than word sentence length
    numBlanks = len(x)-1
  elif len(x) == 6: #if the sentence chosen is shorter than 6 words, the number of blanks will be 3
    numBlanks = 3
  print("numBlanks:", numBlanks)

  inputNumbers = [i for i in range(numBlanks, len(x))] #a list of the indicies from the numBlanks to length of the split sentence
  print("input:", inputNumbers)
  
  mod = choices(inputNumbers, k=(len(x)//10)+1) # !DO: @LEAH --> what does this line do?????? comment porfa
  mod.sort() #sorts the list of indicies smallest to largest
  print("mod:", mod)


  dic = {
    'text': x, 
    'modify-list': mod,
    'modifiers': ['magically', 'organically', 'going']
  }
  # }}}

  return render_template('home.html', data=dic)

app.debug = True
if __name__ == '__main__':
  app.run(host='0.0.0.0', port=80)