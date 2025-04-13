for order items

Qte : entered by user
discount :  (optional fixed value): entered
discountPercentage :  (optional fixed value): entered
unitePriceHt : fetched from article
tvaPercentage: from the article

totalHt = unitePriceHt * qte
unitePriceTtc = unitePriceHt * (1+tvaPercentage /100)
totalTtc = unitePriceTtc * qte

netAmountHt = totalHt - (totalHt * discountPercentage / 100)
netAmountTtc = totalTtc - (totalTtc * discountPercentage / 100)

totalTva = unitePriceHt * (tvaPercentage / 100) * qte ||  netAmountTtc - netAmountHt

for order :
totalHt = sum(netAmountHt for orderItems)
totalTtc = sum(netAmountTtc for orderItems)
totalTva = sum(totalTva for orderItems)

netAmountHt = totalHt - (totalHt * discountPercentage / 100)
netAmountTtc = totalTtc - (totalTtc * discountPercentage / 100)

netToPay = netAmountTtc + stampDuty