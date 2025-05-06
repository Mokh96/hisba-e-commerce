import { Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { Article } from 'src/modules/articles/entities/article.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { ArticlesService } from 'src/modules/articles/articles.service';
import { ProductsService } from 'src/modules/products/products.service';
import { CreateCartItemDto } from 'src/modules/cart-items/dto/create-cart-item.dto';
import { OrderItem } from 'src/modules/order-items/entities/order-item.entity';

interface OptionalData {
  articles?: Article[];
  products?: Pick<Product, 'id' | 'isOutStock'>[];
}

@Injectable()
export class OrderCalculationService {
  constructor(private readonly articlesService: ArticlesService, private readonly productsService: ProductsService) {}

  async calculateOrderItems(createCartItemsDto: CreateCartItemDto[], options: OptionalData = {}) {
    const discountPercentage = 0;
    let productTotalHt = 0;
    let productTotalTtc = 0;
    let productTotalTva = 0;
    const stampDuty = 0;

    /* const articles = await this.articlesService.getArticlesByIds(createCartItemsDto.map((i) => i.articleId));
 
     const products: Pick<Product, 'id' | 'isOutStock'>[] = await this.productsService.getProductsByIds(
       articles.map((i) => i.productId),
       { select: { isOutStock: true, id: true } },
     );*/

    const articles =
      options.articles ?? (await this.articlesService.getArticlesByIds(createCartItemsDto.map((i) => i.articleId)));

    const products =
      options.products ??
      (await this.productsService.getProductsByIds(
        articles.map((a) => a.productId),
        { select: { id: true, isOutStock: true } },
      ));

    const orderItems: DeepPartial<OrderItem>[] = [];

    for (const cartAndOrderItem of createCartItemsDto) {
      const article = articles.find((a) => a.id === cartAndOrderItem.articleId);
      const product = products.find((p) => p.id === article.productId);

      const unitePriceHt = article.price;
      const tvaPercentage = article.tvaPercentage;
      const unitePriceTtc = unitePriceHt * (1 + tvaPercentage / 100);
      const totalHt = unitePriceHt * cartAndOrderItem.quantity;
      const totalTtc = unitePriceTtc * cartAndOrderItem.quantity;
      const netAmountHt = totalHt - (totalHt * discountPercentage) / 100;
      const netAmountTtc = totalTtc - (totalTtc * discountPercentage) / 100;
      const totalTva = netAmountTtc - netAmountHt;

      orderItems.push({
        isOutStock: product.isOutStock,
        quantity: cartAndOrderItem.quantity,
        note: cartAndOrderItem.note,
        offset: cartAndOrderItem.offset,
        articleId: article.id,
        articleRef: article.ref,
        articleLabel: article.label,
        discountPercentage,
        unitePriceHt,
        unitePriceTtc,
      });

      productTotalHt += totalHt;
      productTotalTtc += totalTtc;
      productTotalTva += totalTva;
    }

    return {
      orderItems,
      productTotalHt,
      productTotalTtc,
      productTotalTva,
    };
  }
}
