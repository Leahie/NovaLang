import torch 
import torch.nn as nn
from transformers import AutoTokenizer, AutoModelForCausalLM
from datasets import load_dataset
from torch.utils.data import DataLoader
from transformers import AutoModelForSequenceClassification
# Dataloader
from torch.utils.data import DataLoader 
# Optimizer
from torch.optim import AdamW
# Learning Rate Scheduler 
from transformers import get_scheduler
# Training Loop
from tqdm.auto import tqdm
# Evaluate 
import evaluate 
torch.cuda.empty_cache()

print(torch.cuda.is_available())
print(torch.cuda.device_count())
print(torch.cuda.current_device())
torch.cuda.device(0)
print(torch.cuda.get_device_name(0))

# setting device on GPU if available, else CPU
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print('Using device:', device)
print()

tokenizer = tokenizer = AutoTokenizer.from_pretrained("bert-base-cased")
model = AutoModelForSequenceClassification.from_pretrained("bert-base-cased", num_labels=5)
model = model.to(device)

if tokenizer.pad_token is None:
    tokenizer.add_special_tokens({'pad_token': '[PAD]'})
    model.resize_token_embeddings(len(tokenizer))

dataset_train = load_dataset("yelp_review_full", split='train[0:65000]')
dataset_test = load_dataset("yelp_review_full", split='test')

def tokenize_function(val):
    return tokenizer(val["text"], padding="max_length", truncation=True)

print(dataset_train, dataset_test) #650000 x 50000
tokenized_datasets_train = dataset_train.map(tokenize_function, batched=True)
tokenized_datasets_test = dataset_test.map(tokenize_function, batched=True)

tokenized_datasets_train = tokenized_datasets_train.remove_columns(["text"])
tokenized_datasets_train = tokenized_datasets_train.rename_column("label", "labels")
tokenized_datasets_train.set_format("torch")
tokenized_datasets_test = tokenized_datasets_test.remove_columns(["text"])
tokenized_datasets_test = tokenized_datasets_test.rename_column("label", "labels")
tokenized_datasets_test.set_format("torch")
small_train_dataset = tokenized_datasets_train.shuffle(seed=42).select(range(1000))
small_eval_dataset = tokenized_datasets_test.shuffle(seed=42).select(range(1000))


# Dataloader
train_dataloader = DataLoader(small_train_dataset, shuffle=True, batch_size=2)
eval_dataloader = DataLoader(small_eval_dataset, batch_size=2)

# Optimizer
optimizer = AdamW(model.parameters(), lr=5e-5)

# Learning Rate Scheduler 
num_epochs = 3
num_training_steps = num_epochs * len(train_dataloader)
lr_scheduler = get_scheduler(name="linear", optimizer=optimizer, num_warmup_steps=0, num_training_steps=num_training_steps)
if device.type == 'cuda':
            print(torch.cuda.get_device_name(0))
            print('Memory Usage:')
            print('Allocated:', round(torch.cuda.memory_allocated(0)/1024**3,1), 'GB')
            print('Cached:   ', round(torch.cuda.memory_cached(0)/1024**3,1), 'GB')

# Training Loop
progress_bar = tqdm(range(num_training_steps))

model.train()
for epoch in range(num_epochs):
    for batch in train_dataloader:
        batch = {k: v.to(device) for k, v in batch.items()}
        outputs = model(**batch)
        loss = outputs.loss
        loss.backward()
        
#Additional Info when using cuda
        if device.type == 'cuda':
            print(torch.cuda.get_device_name(0))
            print('Memory Usage:')
            print('Allocated:', round(torch.cuda.memory_allocated(0)/1024**3,1), 'GB')
            print('Cached:   ', round(torch.cuda.memory_cached(0)/1024**3,1), 'GB')

        optimizer.step()
        lr_scheduler.step()
        optimizer.zero_grad()
        progress_bar.update(1)

# Evaluate 
metric = evaluate.load("accuracy")
model.eval()
for batch in eval_dataloader:
    batch = {k: v.to(device) for k,v in batch.items()}
    with torch.no_grad():
        outputs = model(**batch)

    logits = outputs.logits
    predictions = torch.argmax(logits, dim=-1)
    metric.add_batch(predictions=predictions, references = batch["labels"])

print(metric.compute())