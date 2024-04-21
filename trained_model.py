import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = AutoModelForCausalLM.from_pretrained("./results")
tokenizer = AutoTokenizer.from_pretrained("./results")


inputs = tokenizer.encode("This movie was really", return_tensors="pt").to(device)
outputs = model.generate(inputs,max_new_tokens=20)
print(outputs)
for i in range(20):
    print(tokenizer.decode(outputs[i]))

