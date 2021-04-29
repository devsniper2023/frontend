## DO NOT COMMIT TRANSLATION SUBMISSIONS HERE

Instead, you can help us translate Flexpool.io website to your language at [Crowdin](https://crowdin.com/project/flexpoolio-website).

## USING PLURALS

Some sentences might be in plural definition, e.g. `someKey, someKey_1, someKey_2`. Different plural indexes are used per language.

For example english uses

```
someKey: "You have {{count}} chicken // You have 1 chicken
someKey_plural: "You have {{count}} chickens // You have (0, 2-n) chickens
```

Czech language uses

```
someKey: "Máš {{count}} kuře // Máš 1 kuře
someKey_1: "Máš {{count}} chickens // You have (2-4) kuřata
someKey_2: "Máš {{count}} chickens // You have (0,5-n) kuřat
```

To check which indexes are used in your language, use this fiddle below:
https://jsfiddle.net/sm9wgLze
