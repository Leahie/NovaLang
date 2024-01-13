from transformers import AutoTokenizer
from datasets import load_dataset

dataset = load_dataset("bookcorpus")
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
print(dataset)

sequence = dataset
encoded_input = tokenizer(sequence, padding=True, truncation=True, return_tensors="pt")