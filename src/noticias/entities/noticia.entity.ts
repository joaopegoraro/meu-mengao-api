import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Noticia {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    link: string;

    @Column()
    titulo: string;

    @Column()
    site: string;

    @Column()
    logoSite: string;

    @Column()
    foto: string;
}
