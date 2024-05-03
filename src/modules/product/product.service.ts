import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, FindOptionsWhere } from 'typeorm';
import { Product } from './models/product.entity';
import { ProductStatus } from '@/common/constants/enmu';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(entity: DeepPartial<Product>): Promise<boolean> {
    const res = await this.productRepository.save(
      this.productRepository.create(entity),
    );
    if (res) {
      return true;
    }
    return false;
  }

  async findById(id: string): Promise<Product> {
    return this.productRepository.findOne({
      where: {
        id,
      },
      relations: ['org', 'cards', 'cards.course'],
    });
  }

  async getCount(options) {
    return this.productRepository.count(options);
  }

  async updateById(id: string, entity: DeepPartial<Product>): Promise<boolean> {
    const existEntity = await this.findById(id);
    if (!existEntity) {
      return false;
    }
    Object.assign(existEntity, entity);
    const res = await this.productRepository.save(existEntity);
    if (res) {
      return true;
    }
    return false;
  }

  async findProducts({
    start,
    length,
    where,
  }: {
    start: number;
    length: number;
    where: FindOptionsWhere<Product>;
  }): Promise<[Product[], number]> {
    return this.productRepository.findAndCount({
      take: length,
      skip: start,
      where,
      order: {
        createdAt: 'DESC',
      },
      relations: ['org'],
    });
  }

  /**
   * 按照坐标距离排序
   * @param param0
   * @returns
   */
  async findProductsOrderByDistance({
    start,
    length,
    where,
    position,
  }: {
    start: number;
    length: number;
    where: FindOptionsWhere<Product>;
    position: {
      latitude: number;
      longitude: number;
    };
  }): Promise<{ entities: Product[]; raw: any[] }> {
    return this.productRepository
      .createQueryBuilder('product')
      .select('product')
      .addSelect(
        `
      ST_Distance(ST_GeomFromText('POINT(${position.latitude} ${position.longitude})', 4326), 
      ST_GeomFromText(CONCAT('POINT(', organization.latitude, ' ', organization.longitude, ')'), 4326))
    `,
        'distance',
      )
      .innerJoinAndSelect('product.org', 'organization')
      .where(`product.status = '${ProductStatus.LIST}'`)
      .andWhere(`product.name LIKE '%${where.name || ''}%'`)
      .andWhere(where.type ? `product.type = '${where.type}'` : '1=1')
      .orderBy('distance', 'ASC')
      .take(length)
      .skip(start)
      .getRawAndEntities();
  }

    /**
   * 按照购买量排序
   * @param param0
   * @returns
   */
  async findProductsOrderByBuyNumber({
                                       start,
                                       length,
                                       where,
                                     }: {
    start: number;
    length: number;
    where: FindOptionsWhere<Product>;
  }): Promise<{ entities: Product[]; raw: any[] }> {
    return this.productRepository
        .createQueryBuilder('product')
        .select('product')
        .innerJoinAndSelect('product.org', 'organization')
        .where('product.status = :status', { status: ProductStatus.LIST })
        .andWhere('product.name LIKE :name', { name: `%${where.name || ''}%` })
        .andWhere(where.type ? 'product.type = :type' : '1=1', { type: where.type })
        .orderBy('product.buyNumber', 'DESC') // 按照 BuyNumber 降序排序
        .take(length)
        .skip(start)
        .getRawAndEntities();
  }

  async deleteById(id: string, userId: string): Promise<boolean> {
    const res1 = await this.productRepository.update(id, {
      deletedBy: userId,
    });
    if (res1) {
      const res = await this.productRepository.softDelete(id);
      if (res.affected > 0) {
        return true;
      }
    }
    return false;
  }
}
