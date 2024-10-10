import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/base/classes/base.entity';

@Entity('plans')
export class PlanEntity extends BaseEntity {
  @ApiProperty({ example: 'Premium', description: 'Subscription title' })
  @Column({ unique: true })
  title: string;

  @ApiProperty({ example: 'price_fdEF3d3f', description: 'Stripe price ID' })
  @Column({ unique: true })
  stripePriceId: string;
}
