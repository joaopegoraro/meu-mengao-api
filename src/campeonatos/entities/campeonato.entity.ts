import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Campeonato {
    @PrimaryColumn()
    id: string;

    @Column({ nullable: true })
    ano: string;

    @Column({ nullable: true })
    nome: string;

    @Column({ nullable: true })
    link: string;

    @Column({ nullable: true, type: 'text' })
    logo: string;
}
