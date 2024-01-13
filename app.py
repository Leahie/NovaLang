from flask import Flask, render_template, request
app = Flask(__name__)


# ROUTE TO GENERATE THE FORM
@app.route('/')
def home():
  # In the future all of this will be generated from the LLM 
  dic = {
    'text': "Michelle's eyes slowly open. She's back on the mattress, thin blanket covering her again. A tray of food sits on the floor next to the bed. The two four and shovel are gone. Howard sits on a folding chair by the door, his forearm i now wrapped with a bandage where she hit him with the woo She peers at him through the dim light. Is he sleeping? props herself up. His voice cuts through the darkness, startling her",
    'modify-list': [2, 8, 10, 15, 19, 20],
    'modifiers': ['magically', 'organically', 'going']
  }
  return render_template('home.html', data=dic)

app.debug = True
if __name__ == '__main__':
  app.run(host='0.0.0.0', port=80)