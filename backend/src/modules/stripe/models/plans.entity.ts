import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('plans')
export class PlanEntity {
  @ApiProperty({ example: '1', description: 'Unique ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Premium', description: 'Subscription title' })
  @Column({ unique: true })
  title: string;

  @ApiProperty({ example: 'price_fdEF3d3f', description: 'Stripe price ID' })
  @Column({ unique: true })
  stripePriceId: string;
}
