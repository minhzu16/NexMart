/**
 * Product Domain Models & Adapters - Matt Pocock Strict TypeScript Standard
 * Maps authoritative Spring Boot Product REST DTOs to UI ViewModels.
 */

export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK' | 'PENDING_APPROVAL';

export interface ProductImage {
  id?: number;
  url: string;
  sortOrder?: number;
  isPrimary?: boolean;
}

export interface ProductDetailDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  listPrice?: number;
  originalPrice?: number;
  stock: number;
  sku?: string;
  brand?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  images?: ProductImage[] | string[];
  attributesJson?: string;
  categoryName?: string;
  categoryId?: number;
  shopId?: number;
  shopName?: string;
  averageRating?: number;
  reviewCount?: number;
  soldCount?: number;
  status: ProductStatus;
}

export interface ProductViewModel {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  discountPercent: number;
  stock: number;
  primaryImage: string;
  galleryImages: string[];
  specifications: Record<string, string>;
  categoryName: string;
  shopName: string;
  averageRating: number;
  reviewCount: number;
  soldCount: number;
  status: ProductStatus;
}

/**
 * Pure adapter converting Spring Boot backend DTO to type-safe Angular ViewModel
 */
export function mapProductDtoToViewModel(dto: ProductDetailDTO): ProductViewModel {
  const rawGallery = Array.isArray(dto.images) ? [...dto.images] : [];
  const galleryUrls = rawGallery
    .map(img => (typeof img === 'string' ? img : img?.url))
    .filter((url): url is string => Boolean(url));

  const primary = dto.imageUrl || dto.thumbnailUrl || galleryUrls[0] || 'assets/placeholder-product.jpg';
  const uniqueImages = Array.from(new Set([primary, ...galleryUrls]));

  const origPrice = dto.originalPrice ?? dto.listPrice ?? null;
  const discount = (origPrice && origPrice > dto.price)
    ? Math.round((1 - dto.price / origPrice) * 100)
    : 0;

  let specs: Record<string, string> = {};
  if (dto.attributesJson) {
    try {
      const parsed = JSON.parse(dto.attributesJson);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        specs = parsed;
      }
    } catch {
      specs = {};
    }
  }

  return {
    id: dto.id,
    name: dto.name,
    description: dto.description || '',
    price: dto.price,
    originalPrice: origPrice && origPrice > dto.price ? origPrice : null,
    discountPercent: discount,
    stock: dto.stock ?? 0,
    primaryImage: primary,
    galleryImages: uniqueImages,
    specifications: specs,
    categoryName: dto.categoryName || 'Sản phẩm',
    shopName: dto.shopName || 'NexMart Store',
    averageRating: dto.averageRating || 0,
    reviewCount: dto.reviewCount || 0,
    soldCount: dto.soldCount || 0,
    status: dto.status
  };
}

