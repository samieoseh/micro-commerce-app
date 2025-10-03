// products.controller.ts
import { Request, Response } from 'express';
import { productsService } from './products.service';
import { ProductPayload, ProductUpdatePayload } from './types/product';

class ProductsController {
  async getProducts(req: Request, res: Response) {
    const {
      page = 1,
      limit = 10
    } = req.query;

    const products = await productsService.getProducts(Number(page), Number(limit));

    res.json({
      success: true, data: products
    })
  }

  async getProductById(req: Request, res: Response) {
    const product = await productsService.getProductById(+req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      data: product,
    });
  }

  async searchProducts(req: Request, res: Response) {
    const {
        q,               // keyword
        category,
        brand,
        minPrice,
        maxPrice,
        page = 1,
        limit = 10
      } = req.query;
      
    const results = await productsService.searchProducts({
        q: q as string,
        category: category as string,
        brand: brand as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        page: Number(page),
        limit: Number(limit),
      })

      res.json({
        success: true,
        data: {...results}
      })
  }

  async createProduct(req: Request, res: Response) {
      const payload: ProductPayload = req.body;
      const product = await productsService.createProduct(payload);

      res.status(201).json({data: {id: product.id, name: product.name}, success: true})
  }

  async updateProduct(req: Request, res: Response) {
    const payload: ProductUpdatePayload = req.body;
    const updatedProduct = await productsService.updateProduct(+req.params.id, payload);

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      data: updatedProduct,
    });
  }

  async deleteProduct(req: Request, res: Response) {
    await productsService.deleteProduct(+req.params.id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  }
}

export default new ProductsController();
