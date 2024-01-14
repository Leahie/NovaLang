from transformers import AutoTokenizer
import random
import datasets
from datasets import load_dataset


dataset = datasets.load_dataset('bookcorpus')
dataset.save_to_disk('book-corpus')

word = dataset['train']['text'][5]
print(word)


def randomSen(data):
    sentence = random.choice(data)


