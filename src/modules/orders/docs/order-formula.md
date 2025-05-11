For order items:

* Qte: entered by user
* Discount: optional fixed value, entered by user
* Discount percentage: optional fixed value, entered by user
* Unite price HT: fetched from article
* TVA percentage: fetched from article

Formulas:

* Total HT = unite price HT \* qte
* Unite price TTC = unite price HT \* (1 + TVA percentage / 100)
* Total TTC = unite price TTC \* qte
* Net amount HT = total HT - (total HT \* discount percentage / 100)
* Net amount TTC = total TTC - (total TTC \* discount percentage / 100)
* Total TVA = unite price HT \* (TVA percentage / 100) \* qte || net amount TTC - net amount HT

For order:

* Total HT = sum(net amount HT for order items)
* Total TTC = sum(net amount TTC for order items)
* Total TVA = sum(total TVA for order items)

Formulas:

* Net amount HT = total HT - (total HT \* discount percentage / 100)
netToPay = netAmountTtc + stampDuty