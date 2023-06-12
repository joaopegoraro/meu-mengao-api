import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Noticia {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    link: string;

    @Column()
    titulo: string;

    @Column()
    data: string;

    @Column()
    site: string;

    @Column({ type: 'text' })
    logoSite: string;

    @Column({ type: 'text' })
    foto: string;
}
